import './Header.css';

function Header() {
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
        </div>
        <div className="header-right">
          <button className="btn-icon" title="Configurações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 18.364m12.728-12.728l-4.243 4.243m-4.242 0L5.636 5.636"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
