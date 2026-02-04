import './KPICards.css';

function KPICards({ totalProjetos, projetosComLocalizacao, projetosSemLocalizacao, campusAtivos }) {
  return (
    <div className="kpi-container">
      <div className="kpi-card kpi-primary">
        <div className="kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div className="kpi-content">
          <p className="kpi-label">Total de Projetos</p>
          <p className="kpi-value">{totalProjetos.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="kpi-card kpi-success">
        <div className="kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div className="kpi-content">
          <p className="kpi-label">Com Localização</p>
          <p className="kpi-value">{projetosComLocalizacao.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="kpi-card kpi-info">
        <div className="kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div className="kpi-content">
          <p className="kpi-label">Campi Ativos</p>
          <p className="kpi-value">{campusAtivos}</p>
        </div>
      </div>

      {projetosSemLocalizacao > 0 && (
        <div className="kpi-card kpi-warning">
          <div className="kpi-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Sem Localização</p>
            <p className="kpi-value">{projetosSemLocalizacao.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPICards;
