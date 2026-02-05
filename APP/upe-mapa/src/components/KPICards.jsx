import { useState } from 'react';
import './KPICards.css';

const DEFINICOES = {
  total: {
    titulo: 'Total de Projetos',
    descricao: 'Quantidade total de linhas (registros) da aba "PROJETOS" da planilha importada. Cada linha representa um projeto de pesquisa ou extensão cadastrado.',
    icon: 'total',
  },
  comLocalizacao: {
    titulo: 'Com Localização',
    descricao: 'Projetos que possuem coordenadas geográficas válidas e campus identificado. Esses registros aparecem no mapa, agrupados por campus da UPE.',
    icon: 'localizacao',
  },
  campiAtivos: {
    titulo: 'Campi Ativos',
    descricao: 'Número de campi/unidades da UPE que têm pelo menos um projeto com localização. Reflete a distribuição territorial dos projetos na planilha.',
    icon: 'campus',
  },
  semLocalizacao: {
    titulo: 'Sem Localização',
    descricao: 'Projetos cujo campus ou unidade de ensino não foi possível identificar automaticamente, ou que não possuem coordenadas. Eles não aparecem no mapa, mas continuam na tabela de dados.',
    icon: 'aviso',
  },
};

function KpiCard({ tipo, label, value, className, definicao, percentual, onClick }) {
  const [showInfo, setShowInfo] = useState(false);
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      className={`kpi-card ${className} ${onClick ? 'kpi-card-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-icon">
        {definicao.icon === 'total' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        )}
        {definicao.icon === 'localizacao' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        )}
        {definicao.icon === 'campus' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        )}
        {definicao.icon === 'aviso' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        )}
      </div>
      <div className="kpi-content">
        <div className="kpi-label-row">
          <p className="kpi-label">{label}</p>
          <button
            type="button"
            className="kpi-info-btn"
            onClick={(e) => { e.stopPropagation(); setShowInfo((v) => !v); }}
            onBlur={() => setShowInfo(false)}
            aria-label={`O que é ${label}?`}
            title={`O que é ${label}?`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {showInfo && (
              <div className="kpi-info-popover">
                <strong>{definicao.titulo}</strong>
                <p>{definicao.descricao}</p>
              </div>
            )}
          </button>
        </div>
        <p className="kpi-value">{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</p>
        {percentual != null && (
          <p className="kpi-percentual">{percentual}%</p>
        )}
      </div>
    </Wrapper>
  );
}

function KPICards({ totalProjetos, projetosComLocalizacao, projetosSemLocalizacao, campusAtivos, onSemLocalizacaoClick }) {
  const total = totalProjetos || 1;
  const pctCom = total ? Math.round((projetosComLocalizacao / total) * 100) : 0;
  const pctSem = total ? Math.round((projetosSemLocalizacao / total) * 100) : 0;

  return (
    <div className="kpi-container">
      <KpiCard
        tipo="total"
        label="Total de Projetos"
        value={totalProjetos}
        className="kpi-primary"
        definicao={DEFINICOES.total}
      />
      <KpiCard
        tipo="localizacao"
        label="Com Localização"
        value={projetosComLocalizacao}
        className="kpi-success"
        definicao={DEFINICOES.comLocalizacao}
        percentual={pctCom}
      />
      <KpiCard
        tipo="campus"
        label="Campi Ativos"
        value={campusAtivos}
        className="kpi-info"
        definicao={DEFINICOES.campiAtivos}
      />
      {projetosSemLocalizacao > 0 && (
        <KpiCard
          tipo="sem"
          label="Sem Localização"
          value={projetosSemLocalizacao}
          className="kpi-warning"
          definicao={DEFINICOES.semLocalizacao}
          percentual={pctSem}
          onClick={onSemLocalizacaoClick}
        />
      )}
    </div>
  );
}

export default KPICards;
