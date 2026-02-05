import './DashboardResumo.css';

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

function DashboardResumo({ lastUploadInfo }) {
  if (!lastUploadInfo?.date) return null;

  return (
    <div className="dashboard-resumo">
      <span className="dashboard-resumo-icon">📅</span>
      <span className="dashboard-resumo-text">
        Última importação:
        {lastUploadInfo.fileName ? (
          <> <strong>{lastUploadInfo.fileName}</strong> em {formatarData(lastUploadInfo.date)}</>
        ) : (
          <> {formatarData(lastUploadInfo.date)}</>
        )}
      </span>
    </div>
  );
}

export default DashboardResumo;
