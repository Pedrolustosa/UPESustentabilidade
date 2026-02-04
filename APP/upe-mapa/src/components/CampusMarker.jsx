import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';

/**
 * Componente de Marker customizado com contador de projetos
 */
function CampusMarker({ campus, coordenadas, projetos, onOpenModal }) {
  const count = projetos.length;
  const markerRef = useRef(null);

  // Cria um ícone HTML customizado com contador
  const createCustomIcon = (count) => {
    // Cores baseadas na quantidade de projetos
    let backgroundColor = '#0D47A1'; // Azul padrão
    if (count > 50) backgroundColor = '#B71C1C'; // Vermelho UPE para muitos projetos
    else if (count > 20) backgroundColor = '#F57C00'; // Laranja para quantidade média
    
    const iconHtml = `
      <div style="
        background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%);
        color: white;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Inter', sans-serif;
      ">
        ${count}
      </div>
    `;

    return divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  };

  const customIcon = createCustomIcon(count);

  // Configura o evento de clique no popup
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      
      marker.on('popupopen', () => {
        // Aguarda o popup ser renderizado
        setTimeout(() => {
          const popupContent = document.querySelector('.leaflet-popup-content');
          if (popupContent) {
            const button = popupContent.querySelector('.btn-ver-projetos');
            if (button) {
              button.addEventListener('click', () => {
                onOpenModal(campus, projetos);
                marker.closePopup();
              });
            }
          }
        }, 100);
      });
    }
  }, [campus, projetos, onOpenModal]);

  return (
    <Marker 
      ref={markerRef}
      position={[coordenadas.latitude, coordenadas.longitude]} 
      icon={customIcon}
    >
      <Popup>
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            {campus}
          </strong>
          <p style={{ margin: '8px 0', fontSize: '12px' }}>
            {count} projeto{count !== 1 ? 's' : ''}
          </p>
          <button
            className="btn btn-primary btn-sm btn-ver-projetos"
            style={{ width: '100%', cursor: 'pointer' }}
          >
            Ver Projetos
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default CampusMarker;
