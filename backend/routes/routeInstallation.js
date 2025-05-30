const express = require("express");
const jwt = require("jsonwebtoken");
const Installation = require("../models/Installation");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Autenticação via JWT
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "yung6thplague");

    // Autorização: apenas role "user"
    if (decoded.role !== "user")
      return res.status(403).json({ message: "Acesso negado" });

    // Buscar o utilizador autenticado
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    // Validação do payload
    const { installDate, address, panelCount, capacityKw } = req.body;
    if (!installDate || !address || panelCount == null || capacityKw == null) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    // Criação e persistência no BD
    const installation = new Installation({
      userId: user._id,
      clientName: user.name,
      installDate,
      address,
      panelCount,
      capacityKw
    });
    await installation.save();

    // Resposta de sucesso
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

module.exports = router;
