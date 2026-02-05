import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api/api';
import { adicionarCoordenadasAosProjetos } from '../utils/campusCoordenadas';
import './UploadButton.css';

function UploadButton({ onDataLoaded, onUploadSuccess, hideButton }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await api.post('/api/v1/upload', formData);

      if (response.data && response.data.dados) {
        const projetosComCoordenadas = adicionarCoordenadasAosProjetos(response.data.dados);
        onDataLoaded(projetosComCoordenadas);
        if (fileInputRef.current) fileInputRef.current.value = '';
        const total = response.data.total_registros || projetosComCoordenadas.length;
        toast.success(`${total} registro(s) carregado(s) com sucesso.`);
        onUploadSuccess?.({ total, fileName: file.name });
      } else {
        toast.error('Resposta inválida do servidor.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Erro ao enviar planilha. Verifique o formato do arquivo (.xlsx ou .xls).';
      toast.error(msg);
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
      {!hideButton && (
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
      )}
    </>
  );
}

export default UploadButton;
