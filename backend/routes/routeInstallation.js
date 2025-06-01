const express = require("express");
const jwt = require("jsonwebtoken");
const Installation = require("../models/Installation");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
 
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "yung6thplague");

   
    if (decoded.role !== "user")
      return res.status(403).json({ message: "Acesso negado" });

   
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

   
    const { installDate, address, panelCount, capacityKw } = req.body;
    if (!installDate || !address || panelCount == null || capacityKw == null) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }


    const installation = new Installation({
      userId: user._id,
      clientName: user.name,
      installDate,
      address,
      panelCount,
      capacityKw
    });
    await installation.save();


    res.status(201).json({
      message: "Instalação registada com sucesso",
      installation
    });
  } catch (err) {
    console.error(err);

    if (err.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Token inválido" });
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expirado" });

    res.status(500).json({ message: "Erro ao registar instalação" });
  }
});

router.put("/validar/:id", auth("tecnico"), async (req, res) => {
  try {
    const installation = await Installation.findById(req.params.id);
    if (!installation) return res.status(404).json({ message: "Instalação não encontrada" });

    installation.validado = true;
    await installation.save();

    res.json({ message: "Instalação validada com sucesso", installation });
  } catch (err) {
    res.status(500).json({ message: "Erro ao validar instalação", error: err.message });
  }
});

module.exports = router;
