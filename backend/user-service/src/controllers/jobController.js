const jobService = require("../services/jobService")
const logger = require("../utils/logger");


exports.generateAIJob = async (req, res) => {
    try {
        const job = await jobService.generateAIJob(req.user.id, req.body);
        res.status(201).json({ message: 'AI job generated', job });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate AI job' });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

exports.getApprovedJobs = async (req, res) => {
    try {
        const jobs = await jobService.getApprovedJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch approved jobs" });
    }
};

exports.approveJob = async (req, res) => {
    try {
        const job = await jobService.approveJob(req.params.id);
        res.json({ message: 'Job approved', job });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve job' });
    }
};

exports.rejectJob = async (req, res) => {
    try {
        await jobService.rejectJob(req.params.id);
        res.json({ message: 'Job rejected and deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject job' });
    }
};

exports.getDraftJobs = async (req, res) => {
    try {
        const jobs = await jobService.getDraftJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch draft jobs' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await jobService.deleteJob(req.params.id);
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete job" });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await jobService.updateJob(req.params.id, req.body);
        res.json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ error: "Failed to update job" });
    }
};
