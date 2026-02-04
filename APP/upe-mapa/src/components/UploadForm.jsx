import { useState } from 'react';
import { api } from '../api/api';
import { adicionarCoordenadasAosProjetos } from '../utils/campusCoordenadas';

function UploadForm({ onDataLoaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/upload', formData);
      
      if (response.data && response.data.dados) {
        // Aplica as coordenadas baseado no campus
        const projetosComCoordenadas = adicionarCoordenadasAosProjetos(response.data.dados);
        onDataLoaded(projetosComCoordenadas);
        setFile(null); // Limpa o input após sucesso
        // Limpa o input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message 
        || error.message 
        || 'Erro ao enviar planilha. Verifique se o arquivo está no formato correto.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="file"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          accept=".xlsx,.xls"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError(null);
          }}
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !file}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Carregando...
            </>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
      {error && (
        <div className="alert alert-danger mt-2 mb-0" role="alert">
          <strong>Erro:</strong> {error}
        </div>
      )}
      {file && !error && (
        <div className="text-muted small mt-1">
          Arquivo selecionado: {file.name}
        </div>
      )}
    </form>
  );
}

export default UploadForm;
