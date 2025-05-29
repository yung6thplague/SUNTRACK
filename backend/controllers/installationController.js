
const Installation = require('../models/Installation');
const PDFDocument = require('pdfkit');

exports.listInstallations = async (req, res) => {
  try {
    const { name, id } = req.query;
    const filter = {};
    if (id) filter._id = id;

    let installs = await Installation.find(filter).populate('user', 'name').exec();

    if (name) {
      const lowerName = name.toLowerCase();
      installs = installs.filter(inst => inst.user && inst.user.name.toLowerCase().includes(lowerName));
    }

    res.json(installs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao listar instalações.' });
  }
};
