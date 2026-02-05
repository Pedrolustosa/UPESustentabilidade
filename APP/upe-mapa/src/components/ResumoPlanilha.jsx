import { useState } from 'react';
import './ResumoPlanilha.css';

function ResumoPlanilha() {
  const [aberto, setAberto] = useState(false);

  return (
    <section className="resumo-planilha">
      <button
        type="button"
        className="resumo-planilha-trigger"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Entenda os dados da planilha</span>
        <span className={`resumo-chevron ${aberto ? 'aberto' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      {aberto && (
        <div className="resumo-planilha-conteudo">
          <div className="resumo-bloco">
            <h4>Origem dos dados</h4>
            <p>
              Os números exibidos vêm da aba &quot;PROJETOS&quot; da planilha Excel que você importou (.xlsx ou .xls).
              Cada linha da planilha corresponde a um projeto de pesquisa ou extensão. As colunas (título, campus, ODS, professor etc.)
              são usadas para filtrar e exibir no mapa e na tabela.
            </p>
          </div>
          <div className="resumo-bloco">
            <h4>Indicadores dos cards</h4>
            <ul>
              <li><strong>Total de Projetos:</strong> quantidade de linhas da aba PROJETOS.</li>
              <li><strong>Com Localização:</strong> projetos com coordenadas válidas e campus identificado; aparecem no mapa.</li>
              <li><strong>Campi Ativos:</strong> quantos campi/unidades têm pelo menos um projeto com localização.</li>
              <li><strong>Sem Localização:</strong> projetos sem campus identificado ou sem coordenadas; não aparecem no mapa.</li>
            </ul>
          </div>
          <div className="resumo-bloco">
            <h4>Como usar</h4>
            <p>
              Use os filtros (Buscar, Campus, ODS) para refinar a lista. Alterne entre Mapa e Tabela de Dados para
              ver a distribuição geográfica ou a lista completa. No mapa, clique em um marcador para ver os projetos daquele campus.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumoPlanilha;
