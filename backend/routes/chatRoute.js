const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser");
const { userChat } = require("../controllers/chatController");

router.post("/chat", authUser, userChat);

module.exports = router;