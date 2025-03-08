const express = require("express");
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// User CRUD routes
router.get("/all", authenticate, getUsers);
router.get("/:id", authenticate, getUser);
router.post("/create", authenticate, roleMiddleware(["SUPER_ADMIN"]), createUser);
router.put("/update/:id", authenticate, roleMiddleware(["SUPER_ADMIN", "HR_Admin", "RECRUITER_ADMIN"]), updateUser);
router.delete("/delete/:id", authenticate, roleMiddleware(["SUPER_ADMIN"]), deleteUser);

module.exports = router;
