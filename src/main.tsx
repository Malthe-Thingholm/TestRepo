import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ExportBarChartElement, ExportTableElement, RawLoadButtonElement } from './LoadData.tsx'
import type { AppDataAug } from './appData'

function Applet() {
  const [data, setData] = useState<AppDataAug | null>(null);

  return (
    <div className="app-container">
      <div className="button-container">
        <RawLoadButtonElement setData={setData} />
      </div>

      <div className="content-container">
        <ExportTableElement data={data} />
        <ExportBarChartElement chartData={data} />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Applet />
  </StrictMode>,
)
