const express = require("express");
const { generateAIJob,getAllJobs, getApprovedJobs ,approveJob, rejectJob, getDraftJobs, getJobById, deleteJob, updateJob } = require("../controllers/jobController");
const {authenticate,roleMiddleware} =require("../middleware/authMiddleware");


const router = express.Router();

router.post('/:id/approve', authenticate, roleMiddleware(["SUPER_ADMIN", "RECRUITER"]), approveJob);
router.get("/all", authenticate, getAllJobs);
router.get("/approved", authenticate, getApprovedJobs);
router.post('/ai-generate', authenticate, generateAIJob);
router.delete("/:id/delete", authenticate, roleMiddleware(["SUPER_ADMIN", "RECRUITER"]), deleteJob);
router.put("/:id/update", authenticate, roleMiddleware(["SUPER_ADMIN", "RECRUITER"]), updateJob);
router.post('/:id/reject', authenticate, roleMiddleware(["SUPER_ADMIN", "RECRUITER"]), rejectJob);
router.get('/drafts', authenticate, roleMiddleware(["SUPER_ADMIN", "RECRUITER"]), getDraftJobs);
router.get('/:id', authenticate, getJobById);

module.exports = router;
