const express = require('express');
const jwt = require('jsonwebtoken');
const Installation = require('../models/Installation');
const User = require('../models/User');

const router = express.Router();

router.get('/installations', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, 'yung6thplague');
    if (decoded.role !== 'tech') return res.status(403).json({ message: 'Acesso negado' });

    const { name, id } = req.query;
    const filter = {};

    if (id) filter._id = id;
    if (name) filter.clientName = new RegExp(name, 'i');

    const installations = await Installation.find(filter)
    .populate('userId', 'name email');
    res.json(installations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter instalações' });
  }
});

module.exports = router;
