const TITULO_KEYS = ['titulo_projeto', 'titulo', 'nome_projeto', 'projeto'];
const CAMPUS_KEYS = ['campus_padrao', 'campus_encontrado', 'professor_unidade_ensino', 'unidade_ensino', 'campus'];
const ODS_KEYS = ['1º Ods', '1º_ods', 'ods', 'primeiro_ods'];
const ABRANGENCIA_KEYS = ['abrangencia', 'abrangência'];
const PROFESSOR_KEYS = ['professor', 'professor_responsavel', 'responsavel'];

export function getTitulo(projeto) {
  for (const key of TITULO_KEYS) {
    const v = projeto[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return 'Projeto sem título';
}

export function getCampus(projeto) {
  for (const key of CAMPUS_KEYS) {
    const v = projeto[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

export function getOds(projeto) {
  for (const key of ODS_KEYS) {
    const v = projeto[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

export function getAbrangencia(projeto) {
  for (const key of ABRANGENCIA_KEYS) {
    const v = projeto[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

export function getProfessor(projeto) {
  for (const key of PROFESSOR_KEYS) {
    const v = projeto[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

export function hasValidCoordenadas(projeto) {
  const lat = projeto.latitude;
  const lng = projeto.longitude;
  return (
    lat != null && lng != null &&
    lat !== '' && lng !== '' &&
    lat !== 'None' && lng !== 'None' &&
    typeof lat === 'number' && typeof lng === 'number' &&
    !Number.isNaN(lat) && !Number.isNaN(lng)
  );
}
