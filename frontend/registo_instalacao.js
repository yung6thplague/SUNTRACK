document.getElementById("instalacaoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeCliente = document.getElementById("nomeCliente").value;
  const localizacao = document.getElementById("localizacao").value;
  const dadosTecnicos = document.getElementById("dadosTecnicos").value;

  const token = sessionStorage.getItem("token");
  if (!token) return alert("Precisas de fazer login!");

  const res = await fetch("http://localhost:3000/api/installations", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify({ nomeCliente, localizacao, dadosTecnicos })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Instalação registada!");
  } else {
    alert(data.erro || "Erro ao registar.");
  }
});
