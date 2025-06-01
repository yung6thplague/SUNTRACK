

const Installation = require("../models/Installation");
const PDFDocument = require('pdfkit');


const createInstallation = async (req, res) => {
  try {
    const { installDate, address, panelCount, capacityKw } = req.body;

    if (!installDate || !address || !panelCount || !capacityKw) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const newInstallation = new Installation({
      installDate,
      address,
      panelCount,
      capacityKw,
      user: req.user.id
    });

    await newInstallation.save();
    res.status(201).json({ message: "Instalação registada com sucesso!", installation: newInstallation });
  } catch (error) {
    console.error("Erro ao registar instalação:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};


const getUserInstallations = async (req, res) => {
  try {
    const installations = await Installation.find({ user: req.user.id }).sort({ installDate: -1 });
    res.json(installations);
  } catch (error) {
    console.error("Erro ao obter instalações:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};


const generateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const inst = await Installation.findById(id);
    if (!inst) return res.status(404).json({ error: "Instalação não encontrada." });

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdf = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=certificado-${id}.pdf`,
        'Content-Length': pdf.length
      });
      res.end(pdf);
    });

    doc.fontSize(20).text('☀️ Certificado de Instalação SUNTRACK', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Cliente: ${inst.clientName}`);
    doc.text(`ID: ${inst._id}`);
    doc.text(`Data de Instalação: ${new Date(inst.installDate).toLocaleDateString()}`);
    doc.text(`Morada: ${inst.address}`);
    doc.text(`Painéis: ${inst.panelCount}`);
    doc.text(`Potência: ${inst.capacityKw} kW`);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar certificado." });
  }
};


module.exports = {
  createInstallation,
  getUserInstallations,
  generateCertificate  
};