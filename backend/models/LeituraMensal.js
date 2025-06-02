const mongoose = require('mongoose');

const LeituraMensalSchema = new mongoose.Schema({
  
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataLeitura: { type: Date, default: Date.now },
  producaoKwH: Number,
  consumoKwH: Number,
  creditoGerado: Number
});

module.exports = mongoose.model('LeituraMensal', LeituraMensalSchema);
