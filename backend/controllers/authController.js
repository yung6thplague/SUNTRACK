const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Credenciais inválidas" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            "yung6thplague", // token secreto
            { expiresIn: "1h" }
        );

        let dashboardPath 
        if(user.role == "tech"){
            dashboardPath = '/dashboard-tech.html'
        } else {
            dashboardPath = '/dashboard.html'
        }

        res.json({ token, dashboardPath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};


exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email já está em uso" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password: hashedPassword, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: "Utilizador registado com sucesso" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao criar conta" });
    }
};

// Middleware para permitir apenas técnicos autenticados
exports.ensureTech = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "yung6thplague");

    if (decoded.role !== "tech") {
      return res.status(403).json({ error: "Acesso restrito a técnicos" });
    }

    req.user = decoded; // opcional: passa os dados para as próximas rotas
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
