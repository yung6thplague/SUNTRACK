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
            { userId: user._id },
            "yung6thplague", // token secreto
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};


exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email já está em uso" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Utilizador registado com sucesso" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao criar conta" });
    }
};
