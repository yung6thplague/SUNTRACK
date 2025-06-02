const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const multer = require("multer");


const router = express.Router();
const SECRET = "yung6thplague";

router.post("/login", async (req, res) => {
  console.log("REQUISIÇÃO LOGIN", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Utilizador não encontrado." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Credenciais inválidas." });
const token = jwt.sign({
  id: user._id,
  email: user.email,
  role: user.role
}, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
