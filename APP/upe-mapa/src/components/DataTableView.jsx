import { useState, useMemo } from 'react';
import { getTitulo, getCampus, getOds, getAbrangencia, getProfessor } from '../utils/projetoFields';
import './DataTableView.css';

const COLS_EXIBIR = [
  { key: 'titulo', label: 'Título', get: getTitulo },
  { key: 'campus', label: 'Campus', get: getCampus },
  { key: 'ods', label: 'ODS', get: getOds },
  { key: 'abrangencia', label: 'Abrangência', get: getAbrangencia },
  { key: 'professor', label: 'Professor', get: getProfessor },
];

function DataTableView({ projetos, filtros, buscaTexto }) {
  const [sortBy, setSortBy] = useState('titulo');
  const [sortAsc, setSortAsc] = useState(true);
  const [pagina, setPagina] = useState(0);
  const TAMANHO_PAGINA = 20;

  const filtrados = useMemo(() => {
    let list = [...(projetos || [])];
    if (filtros?.campus) list = list.filter((p) => getCampus(p) === filtros.campus);
    if (filtros?.ods) list = list.filter((p) => getOds(p) === filtros.ods);
    if (buscaTexto && buscaTexto.trim()) {
      const t = buscaTexto.trim().toLowerCase();
      list = list.filter((p) => {
        const titulo = getTitulo(p).toLowerCase();
        const campus = getCampus(p).toLowerCase();
        const ods = getOds(p).toLowerCase();
        const prof = getProfessor(p).toLowerCase();
        return titulo.includes(t) || campus.includes(t) || ods.includes(t) || prof.includes(t);
      });
    }
    const col = COLS_EXIBIR.find((c) => c.key === sortBy);
    if (col) {
      list.sort((a, b) => {
        const va = col.get(a) || '';
        const vb = col.get(b) || '';
        const cmp = String(va).localeCompare(String(vb), 'pt-BR');
        return sortAsc ? cmp : -cmp;
      });
    }
    return list;
  }, [projetos, filtros, buscaTexto, sortBy, sortAsc]);

  const totalPaginas = Math.ceil(filtrados.length / TAMANHO_PAGINA) || 1;
  const paginados = useMemo(() => {
    const start = pagina * TAMANHO_PAGINA;
    return filtrados.slice(start, start + TAMANHO_PAGINA);
  }, [filtrados, pagina]);

  const handleSort = (key) => {
    setSortBy(key);
    setSortAsc((prev) => (sortBy === key ? !prev : true));
    setPagina(0);
  };

  if (!projetos || projetos.length === 0) {
    return (
      <div className="data-table-empty">
        <p>Nenhum dado carregado. Importe uma planilha para visualizar a tabela.</p>
      </div>
    );
  }

  return (
    <div className="data-table-view">
      <div className="data-table-header">
        <span className="data-table-count">
          {filtrados.length} de {projetos.length} registro(s)
          {buscaTexto?.trim() && ` • filtrado por "${buscaTexto.trim()}"`}
        </span>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {COLS_EXIBIR.map((col) => (
                <th key={col.key}>
                  <button
                    type="button"
                    className="th-sort"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span className="sort-icon">{sortAsc ? ' ↑' : ' ↓'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginados.map((projeto, idx) => (
              <tr key={pagina * TAMANHO_PAGINA + idx}>
                {COLS_EXIBIR.map((col) => (
                  <td key={col.key}>{col.get(projeto) || '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPaginas > 1 && (
        <div className="data-table-pagination">
          <button
            type="button"
            className="btn-pag"
            disabled={pagina === 0}
            onClick={() => setPagina((p) => p - 1)}
          >
            Anterior
          </button>
          <span className="pag-info">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            type="button"
            className="btn-pag"
            disabled={pagina >= totalPaginas - 1}
            onClick={() => setPagina((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTableView;
