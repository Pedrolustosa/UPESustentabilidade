import { useState } from 'react';
import { getCampus, getOds } from '../utils/projetoFields';
import './FilterBar.css';

function FilterBar({ projetos, onFilterChange, buscaTexto, onBuscaChange }) {
  const [filtroCampus, setFiltroCampus] = useState('');
  const [filtroODS, setFiltroODS] = useState('');

  const campusUnicos = [...new Set(projetos.map((p) => getCampus(p)).filter(Boolean))].sort();
  const odsUnicos = [...new Set(projetos.map((p) => getOds(p)).filter(Boolean))].sort();

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
    if (onBuscaChange) onBuscaChange('');
  };

  return (
    <div className="filter-bar">
      {onBuscaChange && (
        <div className="filter-group filter-search">
          <label htmlFor="filtro-busca" className="filter-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Buscar
          </label>
          <input
            id="filtro-busca"
            type="text"
            className="filter-input"
            placeholder="Título, campus, ODS, professor..."
            value={buscaTexto || ''}
            onChange={(e) => onBuscaChange(e.target.value)}
          />
        </div>
      )}
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
          {campusUnicos.map((campus) => (
            <option key={campus} value={campus}>{campus}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="filtro-ods" className="filter-label">
          ODS
        </label>
        <select
          id="filtro-ods"
          className="filter-select"
          value={filtroODS}
          onChange={handleODSChange}
        >
          <option value="">Todos os ODS</option>
          {odsUnicos.map((ods) => (
            <option key={ods} value={ods}>{ods}</option>
          ))}
        </select>
      </div>
      {(filtroCampus || filtroODS || (buscaTexto && buscaTexto.trim())) && (
        <button type="button" className="btn-limpar-filtros" onClick={limparFiltros}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Limpar
        </button>
      )}
    </div>
  );
}

export default FilterBar;
