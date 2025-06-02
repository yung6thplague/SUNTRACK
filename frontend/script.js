document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    sessionStorage.setItem("token", data.token);

    const payloadBase64 = data.token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (payload.role === "tech") {
      window.location = "tech.html";
    } else if (payload.role === "user") {
      window.location = "user.html";
    } else if (payload.role === "gestor") {
      window.location = "monitorizacao.html";
    }
  } else {
    alert(data.erro || "Erro ao fazer login.");
  }
});
