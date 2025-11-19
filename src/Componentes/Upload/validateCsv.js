export function validateCsvContent(csvText) {
  function isValidSiapeMatricula(field) {
    const soDigitos = field.replace(/\D/g, '');

    // ñ aceita notação científica
    if (/e\+/i.test(field)) return false;

    //6 ou 11 dígitos
    return soDigitos.length === 6 || soDigitos.length === 11;
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return { valido: false, message: "Arquivo CSV vazio" };
  }

  const headers = lines[0].split(";").map(h => h.trim().toLowerCase());
  const expectedHeaders = ["nome", "siape/matricula"];

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

    for (const [j, field] of row.entries()) {
      if (field.trim() === "") {
        return { valido: false, message: `Campo vazio encontrado na linha ${i + 1}` };
      }

      
      if (j === 1 && !isValidSiapeMatricula(field.trim())) {
        return { valido: false, message: `SIAPE/Matrícula inválido na linha ${i + 1}: '${field}' (deve ter 6 ou 11 dígitos)` };
      }
    }
  }

  return { valido: true, message: "" };
}
