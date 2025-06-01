const jwt = require("jsonwebtoken");

function auth(roleEsperada) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "yung6thplague"); 

      if (roleEsperada && decoded.role !== roleEsperada) {
        return res.status(403).json({ message: "Acesso negado: role inválida." });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido." });
    }
  };
}

module.exports = auth;
