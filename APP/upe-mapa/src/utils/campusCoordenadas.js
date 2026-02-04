/**
 * Mapeamento de campus da UPE para coordenadas geográficas
 * Baseado nas coordenadas oficiais dos campus
 */
export const CAMPUS_COORDENADAS = {
  "POLI": { latitude: -8.0553, longitude: -34.9514 },
  "FCAP": { latitude: -8.0580, longitude: -34.9049 },
  "FOP": { latitude: -8.0492, longitude: -34.9535 },
  "ESEF": { latitude: -8.0588, longitude: -34.9595 },
  "FENSG": { latitude: -7.9996, longitude: -34.8412 },
  "FCS": { latitude: -8.0631, longitude: -34.8774 },
  "FFPG": { latitude: -8.0625, longitude: -34.9066 },
  "UPE PETROLINA": { latitude: -9.3891, longitude: -40.5030 },
  "UPE GARANHUNS": { latitude: -8.8824, longitude: -36.4966 },
  "UPE CARUARU": { latitude: -8.2845, longitude: -35.9697 },
  "UPE SERRA TALHADA": { latitude: -7.9881, longitude: -38.3006 },
  "UPE ARCOVERDE": { latitude: -8.4189, longitude: -37.0538 },
  "UPE OURICURI": { latitude: -7.8816, longitude: -40.0800 },
  "UPE SALGUEIRO": { latitude: -8.0730, longitude: -39.1245 }
};

/**
 * Normaliza texto removendo acentos e convertendo para maiúsculo
 * @param {string} texto - Texto a ser normalizado
 * @returns {string} Texto normalizado
 */
function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }

  // Remove espaços extras e converte para maiúsculo
  let textoNormalizado = texto.trim().toUpperCase();

  // Remove acentos usando normalização Unicode
  textoNormalizado = textoNormalizado.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return textoNormalizado;
}

/**
 * Resolve o campus canônico baseado em palavras-chave no texto
 * @param {string|number} valorOriginal - Valor original da coluna professor_unidade_ensino
 * @returns {string|null} Código canônico do campus ou null se não encontrar
 */
export function resolverCampus(valorOriginal) {
  // Converte para string se necessário
  if (valorOriginal === null || valorOriginal === undefined) {
    return null;
  }

  // Converte para string (pode vir como número ou outro tipo)
  const textoOriginal = String(valorOriginal).trim();
  
  if (!textoOriginal || textoOriginal === '') {
    return null;
  }

  const texto = normalizarTexto(textoOriginal);

  // Campus de Recife (ordem de prioridade)
  if (texto.includes('POLI') || texto.includes('POLITECNICA')) {
    return 'POLI';
  }
  if (texto.includes('FCAP') || texto.includes('ADMINISTRACAO')) {
    return 'FCAP';
  }
  if (texto.includes('FOP') || texto.includes('ODONTO') || texto.includes('ODONTOLOGIA')) {
    return 'FOP';
  }
  if (texto.includes('ESEF') || texto.includes('EDUCACAO FISICA') || texto.includes('EDUCAÇÃO FÍSICA')) {
    return 'ESEF';
  }
  if (texto.includes('FENSG') || texto.includes('ENFERMAGEM')) {
    return 'FENSG';
  }
  if (texto.includes('FCS') || texto.includes('CIENCIAS DA SAUDE') || texto.includes('CIÊNCIAS DA SAÚDE')) {
    return 'FCS';
  }
  if (texto.includes('FFPG') || texto.includes('FORMACAO DE PROFESSORES') || texto.includes('FORMAÇÃO DE PROFESSORES')) {
    return 'FFPG';
  }

  // Campus do interior
  if (texto.includes('PETROLINA')) {
    return 'UPE PETROLINA';
  }
  if (texto.includes('GARANHUNS')) {
    return 'UPE GARANHUNS';
  }
  if (texto.includes('CARUARU')) {
    return 'UPE CARUARU';
  }
  if (texto.includes('SERRA TALHADA')) {
    return 'UPE SERRA TALHADA';
  }
  if (texto.includes('ARCOVERDE')) {
    return 'UPE ARCOVERDE';
  }
  if (texto.includes('OURICURI')) {
    return 'UPE OURICURI';
  }
  if (texto.includes('SALGUEIRO')) {
    return 'UPE SALGUEIRO';
  }

  return null;
}

/**
 * Busca as coordenadas de um campus baseado no código canônico
 * @param {string} codigoCampus - Código canônico do campus (ex: "POLI", "UPE PETROLINA")
 * @returns {Object|null} Objeto com latitude e longitude ou null se não encontrar
 */
export function buscarCoordenadasCampus(codigoCampus) {
  if (!codigoCampus) {
    return null;
  }

  return CAMPUS_COORDENADAS[codigoCampus] || null;
}

/**
 * Adiciona coordenadas aos projetos baseado na coluna professor_unidade_ensino
 * Usa normalização robusta para identificar campus mesmo com variações de texto
 * @param {Array} projetos - Array de projetos retornados da API
 * @returns {Array} Array de projetos com coordenadas adicionadas
 */
export function adicionarCoordenadasAosProjetos(projetos) {
  if (!Array.isArray(projetos)) {
    return [];
  }

  return projetos.map((projeto) => {
    const projetoComCoordenadas = { ...projeto };

    // Busca o campus na coluna professor_unidade_ensino
    const valorOriginal = projeto.professor_unidade_ensino || 
                          projeto.professor_unidade_ensino_ ||
                          projeto.unidade_ensino ||
                          projeto.campus ||
                          '';

    // Resolve o campus canônico usando normalização robusta
    const campusPadrao = resolverCampus(valorOriginal);

    if (campusPadrao) {
      // Busca as coordenadas usando o código canônico
      const coordenadas = buscarCoordenadasCampus(campusPadrao);

      if (coordenadas) {
        projetoComCoordenadas.latitude = coordenadas.latitude;
        projetoComCoordenadas.longitude = coordenadas.longitude;
        projetoComCoordenadas.campus_padrao = campusPadrao;
        projetoComCoordenadas.campus_encontrado = valorOriginal;
      } else {
        projetoComCoordenadas.latitude = null;
        projetoComCoordenadas.longitude = null;
        projetoComCoordenadas.campus_padrao = null;
        projetoComCoordenadas.campus_encontrado = valorOriginal || 'Não identificado';
      }
    } else {
      // Se não encontrou, define como null
      projetoComCoordenadas.latitude = null;
      projetoComCoordenadas.longitude = null;
      projetoComCoordenadas.campus_padrao = null;
      projetoComCoordenadas.campus_encontrado = valorOriginal || 'Não identificado';
    }

    return projetoComCoordenadas;
  });
}
