// backend/scripts/dbAccount.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')();
const User = require('./models/User');

async function run() {
  try {
    
    await mongoose.connect("mongodb+srv://admin:admin@suntrack.b8p1vki.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("==== Criar nova conta ====");

    const name = prompt("Nome completo: ");
    const email = prompt("Email: ");
    const plainPassword = prompt("Senha: ", { echo: '*' });

    console.log("\nEscolha o tipo de utilizador:");
    console.log("1 - Cliente");
    console.log("2 - Técnico");
    console.log("3 - Gestor de Operações");

    const roleChoice = prompt("Opção (1/2/3): ");

    let role = "";
    switch (roleChoice) {
      case "1":
        role = "user";  
        break;
      case "2":
        role = "tech";
        break;
      case "3":
        role = "gestor";
        break;
      default:
        console.log("Opção inválida. Abortando.");
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const userSafe = newUser.toObject();
    delete userSafe.password;

    console.log('\n✅ Conta criada com sucesso:\n', userSafe);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erro ao criar conta:', err.message);
    process.exit(1);
  }
}

run();
