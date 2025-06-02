document.getElementById("pesquisaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomePesquisa").value;
  const id = document.getElementById("idPesquisa").value;
  const token = sessionStorage.getItem("token");
  if (!token) return alert("Precisas de login!");

  let url = "http://localhost:3000/api/installations?";
  if (nome) url += "nome=" + encodeURIComponent(nome) + "&";
  if (id) url += "id=" + encodeURIComponent(id);

  const res = await fetch(url, {
    headers: { "Authorization": "Bearer " + token }
  });
  const dados = await res.json();

  console.log("Dados recebidos:", dados);

  let html = "";
  if (Array.isArray(dados)) {
    dados.forEach(inst => {
      html += `<div>
        <b>${inst.nomeCliente}</b> (${inst.localizacao})<br>
        ID: ${inst._id}<br>
        <form data-id="${inst._id}" class="uploadForm" enctype="multipart/form-data">
          <input type="file" name="certificado" accept="application/pdf" required />
          <button type="submit">Upload Certificado</button>
        </form>
        ${inst.certificadoValido ? `
          <div class="certificado-validado">
            ✅ Certificado validado!
            ${inst.validadoPor ? `<div class="tecnico-info">Por: ${inst.validadoPor.nome} (${inst.validadoPor.email})</div>` : ""}
          </div>
        ` : ""}
        <hr>
      </div>`;
    });
  } else {
    html = "Sem resultados.";
  }
  document.getElementById("resultados").innerHTML = html;

  document.querySelectorAll(".uploadForm").forEach(form => {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const id = form.getAttribute("data-id");
      const fileInput = form.querySelector("input[name=certificado]");
      const formData = new FormData();
      formData.append("certificado", fileInput.files[0]);

      const upres = await fetch(`http://localhost:3000/api/installations/${id}/certificado`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: formData
      });

      if (upres.ok) {
        alert("Certificado carregado!");
        location.reload();
      } else {
        const erroData = await upres.json().catch(() => ({}));
        alert("Erro no upload: " + (erroData.erro || upres.statusText || "Erro desconhecido"));
      }
    });
  });
}); 