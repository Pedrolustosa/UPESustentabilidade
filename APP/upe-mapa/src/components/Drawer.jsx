import { useEffect, useState } from 'react';
import { getTitulo, getOds, getAbrangencia, getProfessor } from '../utils/projetoFields';
import './Drawer.css';

function Drawer({ isOpen, onClose, campus, projetos }) {
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setBusca('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const projetosFiltrados = busca.trim()
    ? projetos.filter((p) =>
        getTitulo(p).toLowerCase().includes(busca.trim().toLowerCase()) ||
        getProfessor(p).toLowerCase().includes(busca.trim().toLowerCase()) ||
        (getOds(p) && getOds(p).toLowerCase().includes(busca.trim().toLowerCase()))
      )
    : projetos;

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="drawer drawer-open" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header">
          <div className="drawer-header-top">
            <div className="drawer-header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="drawer-header-text">
              <h2 id="drawer-title" className="drawer-title">{campus}</h2>
              <p className="drawer-subtitle">
                {projetos.length} projeto{projetos.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              type="button"
              className="drawer-close"
              onClick={onClose}
              aria-label="Fechar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {projetos.length > 3 && (
            <div className="drawer-search-wrap">
              <svg className="drawer-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="drawer-search"
                placeholder="Buscar neste campus..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="drawer-content">
          <div className="projetos-list">
            {projetosFiltrados.length === 0 ? (
              <div className="drawer-empty">
                <p>Nenhum projeto encontrado para &quot;{busca.trim()}&quot;.</p>
              </div>
            ) : (
              projetosFiltrados.map((projeto, index) => (
                <article key={index} className="projeto-card">
                  <div className="projeto-card-accent" />
                  <h3 className="projeto-card-titulo">{getTitulo(projeto)}</h3>
                  <div className="projeto-card-meta">
                    {getOds(projeto) && (
                      <span className="projeto-card-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        {getOds(projeto)}
                      </span>
                    )}
                    {getAbrangencia(projeto) && (
                      <span className="projeto-card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {getAbrangencia(projeto)}
                      </span>
                    )}
                    {getProfessor(projeto) && (
                      <span className="projeto-card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {getProfessor(projeto)}
                      </span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Drawer;
