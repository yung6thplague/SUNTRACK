const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomeCliente: String,
  localizacao: String,
  dadosTecnicos: String,
  certificadoPath: String,
  certificadoValido: { type: Boolean, default: false },
  criadoEm: { type: Date, default: Date.now },

  validadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false
  },
  dataValidacao: {
    type: Date
  }
});

module.exports = mongoose.model('Installation', installationSchema);
