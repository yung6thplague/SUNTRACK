// backend/scripts/dbAccount.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function run() {
  try {
    await mongoose.connect("mongodb+srv://admin:admin@suntrack.b8p1vki.mongodb.net/");

    const name = "Carlos Tech da Silva";
    const email = 'tecnico@teste.com';
    const plainPassword = '123456';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const techUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'tech'
    });

    await techUser.save();

    // Remove apenas o password da saída
    const userSafe = techUser.toObject();
    delete userSafe.password;

    console.log('Conta TECH criada com sucesso:', userSafe);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar conta TECH:', err);
    process.exit(1);
  }
}

run();
