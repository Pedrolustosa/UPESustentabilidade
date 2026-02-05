import './EmptyState.css';

function EmptyState({ onUploadClick }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <h2 className="empty-state-title">Nenhum dado carregado</h2>
      <p className="empty-state-text">
        Importe uma planilha Excel (.xlsx ou .xls) com a aba &quot;PROJETOS&quot; para visualizar o mapa e a tabela de projetos.
      </p>
      <button type="button" className="empty-state-cta" onClick={onUploadClick}>
        Importar planilha
      </button>
    </div>
  );
}

export default EmptyState;
