const formContainer = document.getElementById("formContainer");

function showLogin() {
  formContainer.innerHTML = `
    <h1> SUNTRAK</h1>
    <p class="subtitle">Bem-vindo! Inicie sessão abaixo.</p>
    <form id="loginForm">
      <div class="input-group">
        <input type="email" id="loginEmail" placeholder="Email" required>
      </div>
      <div class="input-group">
        <input type="password" id="loginPassword" placeholder="Senha" required>
      </div>
      <button type="submit" class="btn login">Entrar</button>
      <p class="signup-text">Não possui conta? <a href="#" onclick="showSignup()">Criar conta</a></p>
    </form>
  `;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Erro no login.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  });
}

function showSignup() {
  formContainer.innerHTML = `
    <h1> Criar Conta 🌞</h1>
    <p class="subtitle">Preenche os dados abaixo para te registares.</p>
    <form id="signupForm">
      <div class="input-group">
        <input type="email" id="signupEmail" placeholder="Email" required>
      </div>
      <div class="input-group">
        <input type="password" id="signupPassword" placeholder="Senha" required>
      </div>
      <button type="submit" class="btn login">Registar</button>
      <p class="signup-text">Já tens conta? <a href="#" onclick="showLogin()">Fazer login</a></p>
    </form>
  `;

  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Conta criada com sucesso! Agora podes fazer login.");
        showLogin();
      } else {
        alert(data.message || "Erro ao criar conta.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  });
}

function showDashboard(){
  formContainer.innerHTML = `
    <h1>🌞 Painel do Utilizador</h1>
    <p class="subtitle">Autenticado com sucesso!</p>
    <button class="btn login" onclick="logout()">Sair</button>
  `;
}

function logout(){
  localStorage.removeItem("token");
  showLogin();
}

showLogin();
