const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Define onde guardar os certificados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/certificados';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Endpoint POST
router.post('/', upload.single('certificado'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, 'yung6thplague');
    if (decoded.role !== 'tech') return res.status(403).json({ message: 'Acesso negado' });

    const { userId } = req.body;
    const file = req.file;

    if (!userId || !file) return res.status(400).json({ message: 'Faltam dados.' });

    // Simplesmente responde (podes guardar na BD se quiseres)
    res.json({ message: 'Certificado recebido com sucesso.', path: file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});

module.exports = router;
