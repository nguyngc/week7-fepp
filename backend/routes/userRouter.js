const express = require("express");
const router = express.Router();

const { loginUser, signupUser, getMe } = require("../controllers/userControllers");
  
// login route
router.post("/login", loginUser);
  
// signup route
router.post("/signup", signupUser);

// me route
router.post("/me", getMe);
  
module.exports = router;