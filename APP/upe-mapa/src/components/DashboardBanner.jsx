import './DashboardBanner.css';

function DashboardBanner({ projetosSemLocalizacao, onVerTabela }) {
  if (!projetosSemLocalizacao || projetosSemLocalizacao <= 0) return null;

  return (
    <div className="dashboard-banner">
      <span className="dashboard-banner-icon">⚠️</span>
      <div className="dashboard-banner-text">
        <strong>{projetosSemLocalizacao} projeto(s)</strong> sem localização não aparecem no mapa.
        Veja na tabela para conferir os dados.
      </div>
      <button type="button" className="dashboard-banner-btn" onClick={onVerTabela}>
        Ver na Tabela
      </button>
    </div>
  );
}

export default DashboardBanner;
