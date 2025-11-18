import { useState } from "react";
import "./style.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [eValidoCsv, setIsValidCsv] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateCsvContent = (csvText) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) {
      return { valido: false, message: "Arquivo CSV vazio" };
    }

    const headers = lines[0].split(";").map(h => h.trim().toLowerCase());
    const expectedHeaders = ["nome", "cpf/matricula"];
    if (
      headers.length !== expectedHeaders.length ||
      !expectedHeaders.every((h, i) => h === headers[i])
    ) {
      return { valido: false, message: `Cabeçalhos CSV inválidos. Recebido: ${headers.join(", ")}` };
    }

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(";");
      if (row.length !== headers.length) {
        return { valido: false, message: `Linha ${i + 1} com número incorreto de colunas` };
      }
      for (const field of row) {
        if (field.trim() === "") {
          return { valido: false, message: `Campo vazio encontrado na linha ${i + 1}` };
        }
      }
    }

    return { valido: true, message: "" };
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setIsValidCsv(false);
      setFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const validacao = validateCsvContent(text);
      if (!validacao.valido) {
        alert(validacao.message);
        setIsValidCsv(false);
        setFile(null);
        setErrorMsg(validacao.message);
      } else {
        setIsValidCsv(true);
        setFile(selectedFile);
        setErrorMsg("");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleEnviar = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.detail}`);
        return;
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Erro ao enviar arquivo: " + error.message);
    }
  };

  const handleDownloadTemplate = () => {
    const url = "/template.csv"; // caminho para o template que o leo mandar 
    const link = document.createElement("a");
    link.href = url;
    link.download = "template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container_upload">
      <h1 className="header_upload">Tela de upload</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="campo_upload"
      />

      <button className="btn_enviar" onClick={handleDownloadTemplate}>
        Baixar template (.csv)
      </button>
      <button onClick={handleEnviar} disabled={!eValidoCsv} className="btn_enviar">
        Enviar
      </button>

      {errorMsg && <p style={{ color: "red" }}>Erro: {errorMsg}</p>}
    </div>
  );
}
