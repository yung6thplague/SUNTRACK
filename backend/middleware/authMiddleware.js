const jwt = require("jsonwebtoken");
const SECRET = "yung6thplague";

module.exports = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (role && decoded.role !== role) {
      return res.status(403).json({ erro: 'Acesso negado (role)' });
    }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};
