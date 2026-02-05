import { useState, useRef, useEffect } from 'react';
import './Header.css';

function formatarData(d) {
  if (!d || !(d instanceof Date)) return '';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Header({
  totalProjetos = 0,
  campusAtivos = 0,
  view = 'mapa',
  projetosSemLocalizacao = 0,
  lastUploadInfo = null,
  onImportClick,
  onViewChange,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

  const temDados = totalProjetos > 0;
  const notificacoes = [];
  if (lastUploadInfo?.date) {
    notificacoes.push({
      id: 'upload',
      tipo: 'sucesso',
      titulo: 'Planilha importada',
      texto: lastUploadInfo.fileName
        ? `${lastUploadInfo.fileName} em ${formatarData(lastUploadInfo.date)}`
        : formatarData(lastUploadInfo.date),
    });
  }
  if (temDados && projetosSemLocalizacao > 0) {
    notificacoes.push({
      id: 'sem-local',
      tipo: 'aviso',
      titulo: 'Projetos sem localização',
      texto: `${projetosSemLocalizacao} projeto(s) não aparecem no mapa. Veja na tabela.`,
    });
  }
  if (temDados && notificacoes.length === 0) {
    notificacoes.push({
      id: 'dica',
      tipo: 'info',
      titulo: 'Dica',
      texto: 'Use os filtros e alterne entre Mapa e Tabela para explorar os dados.',
    });
  }

  useEffect(() => {
    function handleClickFora(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">UPE</span>
            </div>
          </div>
          <div className="header-title">
            <h1>Portal de Projetos e Pesquisa</h1>
            <p className="header-subtitle">Universidade de Pernambuco</p>
          </div>
          {temDados && (
            <nav className="header-breadcrumb" aria-label="Navegação">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-sep">/</span>
              <button
                type="button"
                className={`breadcrumb-link ${view === 'mapa' ? 'active' : ''}`}
                onClick={() => onViewChange?.('mapa')}
              >
                Mapa
              </button>
              <span className="breadcrumb-sep">/</span>
              <button
                type="button"
                className={`breadcrumb-link ${view === 'tabela' ? 'active' : ''}`}
                onClick={() => onViewChange?.('tabela')}
              >
                Tabela
              </button>
            </nav>
          )}
        </div>

        <div className="header-right">
          {temDados && (
            <div className="header-summary">
              <span>{totalProjetos.toLocaleString('pt-BR')} projetos</span>
              <span className="header-summary-sep">•</span>
              <span>{campusAtivos} campi</span>
            </div>
          )}

          {onImportClick && (
            <button
              type="button"
              className="btn-header btn-import"
              onClick={onImportClick}
              title="Importar planilha"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="btn-import-text">Importar</span>
            </button>
          )}

          <div className="header-dropdown" ref={notifRef}>
            <button
              type="button"
              className="btn-icon"
              title="Notificações"
              onClick={() => setNotifOpen((v) => !v)}
              aria-expanded={notifOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13 21a1 1 0 0 1-2 0"></path>
              </svg>
              {notificacoes.length > 0 && (
                <span className="btn-icon-badge">{notificacoes.length}</span>
              )}
            </button>
            {notifOpen && (
              <div className="header-dropdown-panel notif-panel">
                <div className="dropdown-panel-header">
                  <strong>Notificações</strong>
                </div>
                <div className="dropdown-panel-body">
                  {notificacoes.length === 0 ? (
                    <p className="dropdown-empty">Nenhuma notificação.</p>
                  ) : (
                    notificacoes.map((n) => (
                      <div key={n.id} className={`notif-item notif-${n.tipo}`}>
                        <strong>{n.titulo}</strong>
                        <p>{n.texto}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="header-dropdown" ref={menuRef}>
            <button
              type="button"
              className="btn-icon"
              title="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            {menuOpen && (
              <div className="header-dropdown-panel menu-panel">
                <div className="dropdown-panel-body">
                  <button type="button" className="dropdown-menu-item">
                    Sobre o portal
                  </button>
                  <button type="button" className="dropdown-menu-item">
                    Ajuda
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
