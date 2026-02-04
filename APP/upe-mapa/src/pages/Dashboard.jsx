import { useState, useMemo } from 'react';
import Header from '../components/Header';
import KPICards from '../components/KPICards';
import FilterBar from '../components/FilterBar';
import UploadButton from '../components/UploadButton';
import MapView from '../components/MapView';
import './Dashboard.css';

function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [filtros, setFiltros] = useState({ campus: '', ods: '' });

  const projetosComCoordenadas = useMemo(() => {
    return projetos.filter(
      (p) => {
        const lat = p.latitude;
        const lng = p.longitude;
        return (
          lat != null &&
          lng != null &&
          lat !== '' &&
          lng !== '' &&
          lat !== 'None' &&
          lng !== 'None' &&
          typeof lat === 'number' &&
          typeof lng === 'number' &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          p.campus_padrao
        );
      }
    );
  }, [projetos]);

  const projetosSemCoordenadas = projetos.length - projetosComCoordenadas.length;
  
  const campusAtivos = useMemo(() => {
    return new Set(projetosComCoordenadas.map(p => p.campus_padrao).filter(Boolean)).size;
  }, [projetosComCoordenadas]);

  const handleFilterChange = (novosFiltros) => {
    setFiltros(novosFiltros);
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        <div className="dashboard-controls">
          <div className="controls-left">
            {projetos.length > 0 && (
              <>
                <KPICards
                  totalProjetos={projetos.length}
                  projetosComLocalizacao={projetosComCoordenadas.length}
                  projetosSemLocalizacao={projetosSemCoordenadas}
                  campusAtivos={campusAtivos}
                />
                <FilterBar projetos={projetos} onFilterChange={handleFilterChange} />
              </>
            )}
          </div>
          <div className="controls-right">
            <UploadButton onDataLoaded={setProjetos} />
          </div>
        </div>

        <div className="map-container">
          <MapView projetos={projetos} filtros={filtros} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
