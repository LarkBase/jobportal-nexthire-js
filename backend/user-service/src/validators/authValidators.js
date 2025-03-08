const { body } = require("express-validator");

exports.loginValidation = [
    body("email").trim().notEmpty().withMessage("Email is required"), 
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];
  