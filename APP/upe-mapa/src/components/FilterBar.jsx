import { useState } from 'react';
import './FilterBar.css';

function FilterBar({ projetos, onFilterChange }) {
  const [filtroCampus, setFiltroCampus] = useState('');
  const [filtroODS, setFiltroODS] = useState('');

  // Extrai campus únicos
  const campusUnicos = [...new Set(projetos.map(p => p.campus_padrao).filter(Boolean))].sort();
  
  // Extrai ODS únicos
  const odsUnicos = [...new Set(projetos.map(p => p['1º Ods']).filter(Boolean))].sort();

  const handleCampusChange = (e) => {
    const valor = e.target.value;
    setFiltroCampus(valor);
    onFilterChange({ campus: valor, ods: filtroODS });
  };

  const handleODSChange = (e) => {
    const valor = e.target.value;
    setFiltroODS(valor);
    onFilterChange({ campus: filtroCampus, ods: valor });
  };

  const limparFiltros = () => {
    setFiltroCampus('');
    setFiltroODS('');
    onFilterChange({ campus: '', ods: '' });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filtro-campus" className="filter-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          Campus
        </label>
        <select
          id="filtro-campus"
          className="filter-select"
          value={filtroCampus}
          onChange={handleCampusChange}
        >
          <option value="">Todos os Campi</option>
          {campusUnicos.map(campus => (
            <option key={campus} value={campus}>{campus}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filtro-ods" className="filter-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          ODS
        </label>
        <select
          id="filtro-ods"
          className="filter-select"
          value={filtroODS}
          onChange={handleODSChange}
        >
          <option value="">Todos os ODS</option>
          {odsUnicos.map(ods => (
            <option key={ods} value={ods}>{ods}</option>
          ))}
        </select>
      </div>

      {(filtroCampus || filtroODS) && (
        <button className="btn-limpar-filtros" onClick={limparFiltros}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Limpar Filtros
        </button>
      )}
    </div>
  );
}

export default FilterBar;
