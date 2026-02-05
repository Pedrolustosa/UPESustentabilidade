import './GraficoBarras.css';

function GraficoBarras({ titulo, dados, maxItens = 10 }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="grafico-barras">
        <h3 className="grafico-titulo">{titulo}</h3>
        <p className="grafico-vazio">Nenhum dado para exibir.</p>
      </div>
    );
  }

  const exibir = dados.slice(0, maxItens);
  const maxVal = Math.max(...exibir.map((d) => d.value), 1);

  return (
    <div className="grafico-barras">
      <h3 className="grafico-titulo">{titulo}</h3>
      <div className="grafico-lista">
        {exibir.map((item, i) => (
          <div key={i} className="grafico-linha">
            <span className="grafico-label" title={item.label}>
              {item.label}
            </span>
            <div className="grafico-barra-wrap">
              <div
                className="grafico-barra"
                style={{ width: `${(item.value / maxVal) * 100}%` }}
              />
            </div>
            <span className="grafico-valor">{item.value.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GraficoBarras;
