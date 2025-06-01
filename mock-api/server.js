const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/production", (req, res) => {
  const{clienteId} = req.params;
  const producao = parseFloat((Math.random() * 100).toFixed(2));
  const timestamp = new Date().toISOString();

  res.json({ producao, timestamp });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Mock a correr em http://localhost:${PORT}/production`);
});
