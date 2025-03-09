const prisma = require("../config/db");
const { generateJobDescriptionWithAI } = require("../utils/aiService");

exports.generateAIJob = async (userId, { title, summary }) => {
    if (!title || !summary) {
        throw new Error("Title and summary are required");
    }

    try {
        // Get AI-generated job description & structured skills
        const aiResponse = await generateJobDescriptionWithAI(summary);
        if (!aiResponse.description || !aiResponse.skills.length) {
            throw new Error("AI failed to generate job details.");
        }

        // Store job as draft
        const job = await prisma.job.create({
            data: {
                title,
                description: aiResponse.description,
                status: "DRAFT",
                postedById: userId,
            },
        });

        // Store AI-generated skills in JobSkills table
        await prisma.jobSkills.createMany({
            data: aiResponse.skills.map((skill) => ({
                jobId: job.id,
                skill: skill.name,
                isMandatory: skill.mandatory,
                category: skill.category,
            })),
        });

        // Log AI generation in AuditLog
        await prisma.auditLog.create({
            data: {
                action: `AI-generated job: ${title}`,
                performedById: userId,
            },
        });

        return job;
    } catch (error) {
        console.error("Error in generateAIJob:", error);
        throw new Error("Failed to generate AI job.");
    }
};

exports.getAllJobs = async () => {
    try {
        return await prisma.job.findMany({
            include: { skills: true },
        });
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        throw new Error("Failed to fetch jobs");
    }
};

exports.getApprovedJobs = async () => {
    try {
        return await prisma.job.findMany({
            where: { status: "APPROVED" },
            include: { skills: true },
        });
    } catch (error) {
        console.error("Error fetching approved jobs:", error);
        throw new Error("Failed to fetch approved jobs");
    }
};

exports.approveJob = async (jobId) => {
    try {
        return await prisma.job.update({
            where: { id: jobId },
            data: { status: "APPROVED" },
        });
    } catch (error) {
        console.error("Error approving job:", error);
        throw new Error("Failed to approve job");
    }
};

exports.rejectJob = async (jobId) => {
    try {
        await prisma.jobSkills.deleteMany({ where: { jobId } });
        await prisma.job.delete({ where: { id: jobId } });
    } catch (error) {
        console.error("Error rejecting job:", error);
        throw new Error("Failed to reject job");
    }
};

exports.deleteJob = async (jobId) => {
    try {
        await prisma.jobSkills.deleteMany({ where: { jobId } });
        await prisma.job.delete({ where: { id: jobId } });
    } catch (error) {
        console.error("Error deleting job:", error);
        throw new Error("Failed to delete job");
    }
};

exports.getDraftJobs = async () => {
    try {
        return await prisma.job.findMany({ where: { status: "DRAFT" } });
    } catch (error) {
        console.error("Error fetching draft jobs:", error);
        throw new Error("Failed to fetch draft jobs");
    }
};

exports.getJobById = async (jobId) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { skills: true },
        });

        if (!job) throw new Error("Job not found");
        return job;
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        throw new Error("Failed to fetch job");
    }
};

exports.updateJob = async (jobId, { title, description, skills }) => {
    try {
        // Update job details
        const job = await prisma.job.update({
            where: { id: jobId },
            data: {
                title,
                description,
            },
        });

        if (skills && skills.length > 0) {
            // Get existing skills for the job
            const existingSkills = await prisma.jobSkills.findMany({
                where: { jobId },
            });

            const existingSkillIds = existingSkills.map(skill => skill.id);
            const newSkills = [];
            const updatedSkills = [];

            skills.forEach(skill => {
                if (skill.id && existingSkillIds.includes(skill.id)) {
                    // If skill exists, update it
                    updatedSkills.push(
                        prisma.jobSkills.update({
                            where: { id: skill.id },
                            data: {
                                skill: skill.skill,
                                isMandatory: skill.isMandatory,
                                category: skill.category,
                            },
                        })
                    );
                } else {
                    // If skill does not exist, add it
                    newSkills.push({
                        jobId,
                        skill: skill.skill,
                        isMandatory: skill.isMandatory,
                        category: skill.category,
                    });
                }
            });

            // Delete removed skills (skills that are not in the new request)
            const skillsToDelete = existingSkills
                .filter(skill => !skills.some(s => s.id === skill.id))
                .map(skill => skill.id);

            await prisma.$transaction([
                ...updatedSkills, // Update existing skills
                prisma.jobSkills.createMany({ data: newSkills }), // Insert new skills
                prisma.jobSkills.deleteMany({ where: { id: { in: skillsToDelete } } }) // Delete missing skills
            ]);
        }

        return job;
    } catch (error) {
        console.error("Error updating job:", error);
        throw new Error("Failed to update job");
    }
};
