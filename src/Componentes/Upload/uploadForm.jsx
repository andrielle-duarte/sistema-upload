import React, { useState } from "react";
import { validateCsvContent } from "./validateCsv";
import "./style.css";

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [eValidoCsv, setIsValidCsv] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

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
            console.log("Arquivo para enviar:", file);
            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro: ${errorData.detail}`);
                setErrorMsg(errorData.detail);
                return;
            }
            const data = await response.json();
            alert(data.message);
            setErrorMsg("");
        } catch (error) {
            alert("Erro ao enviar arquivo: " + error.message);
            setErrorMsg(error.message);
        }
    };

    const handleDownloadTemplate = () => {
        const url = "/template.csv";
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
            <button className="btn_download" onClick={handleDownloadTemplate}>
                Baixar template (.csv)
            </button>
            <button
                onClick={handleEnviar}
                disabled={!eValidoCsv}
                className="btn_enviar"
            >
                Enviar
            </button>
            {errorMsg && <p style={{ color: "red" }}>Erro: {errorMsg}</p>}
        </div>
    );
}
