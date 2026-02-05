import { useState, useMemo } from 'react';
import Header from '../components/Header';
import KPICards from '../components/KPICards';
import ResumoPlanilha from '../components/ResumoPlanilha';
import DashboardResumo from '../components/DashboardResumo';
import DashboardBanner from '../components/DashboardBanner';
import GraficoBarras from '../components/GraficoBarras';
import FilterBar from '../components/FilterBar';
import UploadButton from '../components/UploadButton';
import MapView from '../components/MapView';
import DataTableView from '../components/DataTableView';
import EmptyState from '../components/EmptyState';
import { hasValidCoordenadas, getCampus, getOds } from '../utils/projetoFields';
import './Dashboard.css';

function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [filtros, setFiltros] = useState({ campus: '', ods: '' });
  const [buscaTexto, setBuscaTexto] = useState('');
  const [view, setView] = useState('mapa');
  const [lastUploadInfo, setLastUploadInfo] = useState(null);

  const projetosComCoordenadas = useMemo(() => {
    return projetos.filter((p) => hasValidCoordenadas(p) && getCampus(p));
  }, [projetos]);

  const projetosSemCoordenadas = projetos.length - projetosComCoordenadas.length;
  const campusAtivos = useMemo(() => {
    return new Set(projetosComCoordenadas.map((p) => getCampus(p)).filter(Boolean)).size;
  }, [projetosComCoordenadas]);

  const dadosPorCampus = useMemo(() => {
    const map = {};
    projetos.forEach((p) => {
      const c = getCampus(p);
      const key = c || 'Não informado';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [projetos]);

  const dadosPorODS = useMemo(() => {
    const map = {};
    projetos.forEach((p) => {
      const o = getOds(p);
      const key = o || 'Não informado';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [projetos]);

  const handleFilterChange = (novosFiltros) => {
    setFiltros(novosFiltros);
  };

  const handleEmptyStateUpload = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleImportClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleVerTabela = () => setView('tabela');

  const temDados = projetos.length > 0;

  return (
    <div className="dashboard-container">
      <Header
        totalProjetos={projetos.length}
        campusAtivos={campusAtivos}
        view={view}
        projetosSemLocalizacao={projetosSemCoordenadas}
        lastUploadInfo={lastUploadInfo}
        onImportClick={handleImportClick}
        onViewChange={setView}
      />
      <div className="dashboard-content">
        {temDados && (
          <DashboardBanner
            projetosSemLocalizacao={projetosSemCoordenadas}
            onVerTabela={handleVerTabela}
          />
        )}

        <div className="dashboard-controls">
          <div className="controls-left">
            {temDados && (
              <>
                <DashboardResumo lastUploadInfo={lastUploadInfo} />
                <KPICards
                  totalProjetos={projetos.length}
                  projetosComLocalizacao={projetosComCoordenadas.length}
                  projetosSemLocalizacao={projetosSemCoordenadas}
                  campusAtivos={campusAtivos}
                  onSemLocalizacaoClick={handleVerTabela}
                />
                <ResumoPlanilha />
                <div className="dashboard-graficos">
                  <GraficoBarras titulo="Projetos por campus" dados={dadosPorCampus} maxItens={10} />
                  <GraficoBarras titulo="Projetos por ODS" dados={dadosPorODS} maxItens={10} />
                </div>
                <FilterBar
                  projetos={projetos}
                  onFilterChange={handleFilterChange}
                  buscaTexto={buscaTexto}
                  onBuscaChange={setBuscaTexto}
                />
              </>
            )}
          </div>
          <UploadButton
            onDataLoaded={setProjetos}
            onUploadSuccess={({ total, fileName }) =>
              setLastUploadInfo({ fileName: fileName || null, date: new Date() })
            }
            hideButton
          />
        </div>

        {temDados && (
          <div className="view-tabs">
            <button
              type="button"
              className={`view-tab ${view === 'mapa' ? 'active' : ''}`}
              onClick={() => setView('mapa')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Mapa
            </button>
            <button
              type="button"
              className={`view-tab ${view === 'tabela' ? 'active' : ''}`}
              onClick={() => setView('tabela')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Tabela de Dados
            </button>
          </div>
        )}

        <div className="map-container">
          {!temDados && <EmptyState onUploadClick={handleEmptyStateUpload} />}
          {temDados && view === 'mapa' && (
            <MapView projetos={projetos} filtros={filtros} />
          )}
          {temDados && view === 'tabela' && (
            <DataTableView
              projetos={projetos}
              filtros={filtros}
              buscaTexto={buscaTexto}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
