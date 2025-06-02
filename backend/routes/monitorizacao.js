const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Installation = require('../models/Installation');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/clientes', authMiddleware('gestor'), async (req, res) => {
  try {
    // Primeiro, buscar todas as instalações validadas
    const instalacoesValidadas = await Installation.find({ 
      certificadoValido: true 
    }).distinct('clienteId');

    // Depois, buscar apenas os usuários que têm instalações validadas
    const clientes = await User.find({ 
      role: 'user',
      _id: { $in: instalacoesValidadas }
    });

    const clientesComDados = clientes.map(cliente => {
      const producao = parseFloat((Math.random() * 100).toFixed(2));
      const consumo = parseFloat((Math.random() * 100).toFixed(2));
      // Se a diferença for negativa, mostra 0
      const creditos = Math.max(0, parseFloat((producao - consumo).toFixed(2)));

      return {
        clienteId: cliente._id, 
        nome: cliente.email.split('@')[0],
        email: cliente.email,
        producao,
        consumo,
        creditos
      };
    });

    res.json(clientesComDados);
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    res.status(500).json({ message: 'Erro ao obter dados dos clientes' });
  }
});

module.exports = router;
