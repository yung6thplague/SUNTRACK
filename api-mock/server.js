const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

app.get('/api/leituras/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  
  const leitura = {
    clienteId,
    dataHora: new Date(),
    producaoKwH: parseFloat((Math.random() * 5).toFixed(2)),
    voltagem: 220 + Math.floor(Math.random() * 20),
    corrente: parseFloat((5 + Math.random() * 10).toFixed(2))
  };
  
  res.json(leitura);
});

app.listen(port, () => {
  console.log(`API MOCK ON`);
}); 