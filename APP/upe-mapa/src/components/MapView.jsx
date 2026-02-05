import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import CampusMarker from './CampusMarker';
import Drawer from './Drawer';
import { getCampus, getOds } from '../utils/projetoFields';
import { CAMPUS_COORDENADAS } from '../utils/campusCoordenadas';

// Componente para ajustar o zoom do mapa baseado nos campus
function MapBounds({ projetosPorCampus }) {
  const map = useMap();

  useEffect(() => {
    const campusComProjetos = Object.keys(projetosPorCampus);
    if (campusComProjetos.length > 0) {
      const coordenadas = campusComProjetos
        .map(campus => CAMPUS_COORDENADAS[campus])
        .filter(coord => coord)
        .map(coord => [coord.latitude, coord.longitude]);

      if (coordenadas.length > 0) {
        const bounds = L.latLngBounds(coordenadas);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [projetosPorCampus, map]);

  return null;
}

function MapView({ projetos = [], filtros = {} }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCampus, setDrawerCampus] = useState('');
  const [drawerProjetos, setDrawerProjetos] = useState([]);

  const projetosComCoordenadas = useMemo(() => {
    return projetos.filter((p) => {
      const lat = p.latitude;
      const lng = p.longitude;
      const temCoordenadas =
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
        getCampus(p);
      if (!temCoordenadas) return false;
      if (filtros.campus && getCampus(p) !== filtros.campus) return false;
      if (filtros.ods && getOds(p) !== filtros.ods) return false;
      return true;
    });
  }, [projetos, filtros]);

  const projetosPorCampus = useMemo(() => {
    const grupos = {};
    projetosComCoordenadas.forEach((projeto) => {
      const campus = getCampus(projeto);
      if (campus && CAMPUS_COORDENADAS[campus]) {
        if (!grupos[campus]) grupos[campus] = [];
        grupos[campus].push(projeto);
      }
    });
    return grupos;
  }, [projetosComCoordenadas]);

  // Calcula o centro do mapa baseado nos campus ou usa Recife como padrão
  const center = useMemo(() => {
    const campusComProjetos = Object.keys(projetosPorCampus);
    if (campusComProjetos.length > 0) {
      const coordenadas = campusComProjetos
        .map(campus => CAMPUS_COORDENADAS[campus])
        .filter(coord => coord);
      
      if (coordenadas.length > 0) {
        const latSum = coordenadas.reduce((sum, coord) => sum + coord.latitude, 0);
        const lngSum = coordenadas.reduce((sum, coord) => sum + coord.longitude, 0);
        return [latSum / coordenadas.length, lngSum / coordenadas.length];
      }
    }
    return [-8.0476, -34.8770]; // Recife como padrão
  }, [projetosPorCampus]);

  // Função para abrir o drawer
  const handleOpenDrawer = (campus, projetos) => {
    setDrawerCampus(campus);
    setDrawerProjetos(projetos);
    setDrawerOpen(true);
  };

  // Função para fechar o drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerCampus('');
    setDrawerProjetos([]);
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={Object.keys(projetosPorCampus).length > 0 ? 8 : 7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds projetosPorCampus={projetosPorCampus} />

        {/* Renderiza um marker por campus com contador */}
        {Object.entries(projetosPorCampus).map(([campus, projetosDoCampus]) => {
          const coordenadas = CAMPUS_COORDENADAS[campus];
          if (!coordenadas) return null;

          return (
            <CampusMarker
              key={campus}
              campus={campus}
              coordenadas={coordenadas}
              projetos={projetosDoCampus}
              onOpenModal={handleOpenDrawer}
            />
          );
        })}
      </MapContainer>

      {/* Drawer para exibir projetos do campus */}
      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        campus={drawerCampus}
        projetos={drawerProjetos}
      />
    </>
  );
}

export default MapView;
