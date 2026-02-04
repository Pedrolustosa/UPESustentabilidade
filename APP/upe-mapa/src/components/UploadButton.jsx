import { useState, useRef } from 'react';
import { api } from '../api/api';
import { adicionarCoordenadasAosProjetos } from '../utils/campusCoordenadas';
import './UploadButton.css';

function UploadButton({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/upload', formData);
      
      if (response.data && response.data.dados) {
        const projetosComCoordenadas = adicionarCoordenadasAosProjetos(response.data.dados);
        onDataLoaded(projetosComCoordenadas);
        // Limpa o input
        if (fileInputRef.current) fileInputRef.current.value = '';
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
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="upload-button">
        {loading ? (
          <>
            <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"></path>
            </svg>
            Carregando...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Importar Dados
          </>
        )}
      </label>
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
    </>
  );
}

export default UploadButton;
