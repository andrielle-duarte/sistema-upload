import "./style.css";

export default function Home() {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const processCSV = (csvText) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) {
      console.error("Arquivo CSV vazio");
      return;
    }

    const headers = lines[0].split(';');
    console.log('Cabeçalhos:', headers);
    const data = [];
    let allFieldsFilled = true;

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(';');
      if (row.length !== headers.length) {
        console.warn(`Linha ${i + 1} tem número diferente de colunas.`);
        allFieldsFilled = false;
      }
      for (const field of row) {
        if (field.trim() === '') {
          console.warn(`Campo vazio encontrado na linha ${i + 1}`);
          allFieldsFilled = false;
        }
      }
      data.push(row);
    }

    if (!allFieldsFilled) {
      console.warn('Alguns campos não estão preenchidos.');
      alert('Aviso: Alguns campos não estão preenchidos. Verifique o console para mais detalhes.');
    } else {
      console.log('Todos os campos estão preenchidos.');
    }

    console.table(data);
  };

  const handleDownloadTemplate = () => {
    
    const url = "/template.xlsx"; //caminho do template que o leo disponibilizar na pasta public
    const link = document.createElement("a");
    link.href = url;
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container_upload">
      <h1 className="header_upload">Tela de upload</h1>
      <button className="btn_download" onClick={handleDownloadTemplate}>
        Baixar template (.csv)
      </button>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="campo_upload"
      />
    </div>
  );
}
