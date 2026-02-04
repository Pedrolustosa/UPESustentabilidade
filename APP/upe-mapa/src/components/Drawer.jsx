import { useEffect } from 'react';
import './Drawer.css';

function Drawer({ isOpen, onClose, campus, projetos }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className={`drawer ${isOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{campus}</h2>
            <p className="drawer-subtitle">{projetos.length} projeto{projetos.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="drawer-content">
          <div className="projetos-list">
            {projetos.map((projeto, index) => (
              <div key={index} className="projeto-item">
                <h3 className="projeto-titulo">
                  {projeto.titulo_projeto || 'Projeto sem título'}
                </h3>
                
                <div className="projeto-detalhes">
                  {projeto['1º Ods'] && (
                    <div className="projeto-info">
                      <span className="info-label">ODS:</span>
                      <span className="info-value">{projeto['1º Ods']}</span>
                    </div>
                  )}
                  
                  {projeto.abrangencia && (
                    <div className="projeto-info">
                      <span className="info-label">Abrangência:</span>
                      <span className="info-value">{projeto.abrangencia}</span>
                    </div>
                  )}
                  
                  {projeto.professor && (
                    <div className="projeto-info">
                      <span className="info-label">Professor:</span>
                      <span className="info-value">{projeto.professor}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Drawer;
