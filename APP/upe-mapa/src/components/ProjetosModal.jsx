import { useEffect } from 'react';

function ProjetosModal({ show, onHide, campus, projetos }) {
  useEffect(() => {
    // Controla o body scroll quando o modal está aberto
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show || !projetos || projetos.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onHide}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Projetos - {campus}
                <span className="badge bg-primary ms-2">{projetos.length}</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              />
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="list-group">
                {projetos.map((projeto, index) => (
                  <div
                    key={index}
                    className="list-group-item"
                    style={{ marginBottom: '10px', borderRadius: '8px' }}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1" style={{ fontWeight: 'bold' }}>
                        {projeto.titulo_projeto || 'Projeto sem título'}
                      </h6>
                    </div>
                    
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                      {projeto['1º Ods'] && (
                        <p className="mb-1">
                          <strong>ODS:</strong> {projeto['1º Ods']}
                        </p>
                      )}
                      
                      {projeto.abrangencia && (
                        <p className="mb-1">
                          <strong>Abrangência:</strong> {projeto.abrangencia}
                        </p>
                      )}
                      
                      {projeto.professor && (
                        <p className="mb-1">
                          <strong>Professor:</strong> {projeto.professor}
                        </p>
                      )}
                      
                      {projeto.campus_encontrado && projeto.campus_encontrado !== campus && (
                        <p className="mb-1 text-muted">
                          <small>
                            <strong>Campus original:</strong> {projeto.campus_encontrado}
                          </small>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjetosModal;
