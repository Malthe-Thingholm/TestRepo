import React from "react";
import type { AppData, AppDataItem, AppDataAug, AppDataItemAug } from "./appData.d.ts";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

// Loading the original data from the JSON file. If sucessful it should return the data and null for error
export async function LoadData(): Promise<{ data: AppData | null; error: string | null }> {
  try {
    // Use a path relative to your server root (e.g., /data_sample.json if in 'public')
    const response = await fetch("../public/data_sample.json");
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Error: Data file not found at ${response.url}.`);
      } else {
        throw new Error(
          `Failed to load data. Status: ${response.status} ${response.statusText}`
        );
      }
    }
    const jsonData: AppData = await response.json();
    return { data: jsonData, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: `Failed to load data: ${error.message}` };
    }
    return { data: null, error: "An unknown error occurred while loading data." };
  }
}
// Is meant to augment the data, logically linked with the above data loading function.
// As such it calls the data loading itself instead of being given the data as a parameter.
export async function AugmentData_PerformanceIndex(): Promise<{ data: AppDataAug | null; error: string | null }> {
  try {
    const result = await LoadData();
    if (result.error) {
      return { data: null, error: result.error };
    }
    if (result.data === null) {
      return { data: null, error: "No data available." };
    }
    // The augmentation is split into two steps, for a cleaner expansion of the data.
    // The first step is to format the data, adding the performance_index field and initializing it to 0
    const formatData: AppDataAug = result.data.map((item: AppDataItem) => {
      return {
        ...item,
        performance_index: 0, // Initialize performance_index to 0
      };
    });
    //The second step is to calculate the true new parameters.
    const AugData: AppDataAug = formatData.map((item: AppDataItemAug) => {
      const day = new Date(item.timestamp).getDate();
      const paramLen = item.parameter_set.length;
      if (item.value === null || typeof item.value === "string") {
        item.value = "N/A";
      } else if (item.status === "completed" && day !== 0 && paramLen !== 0) {
        item.performance_index = (item.value / (day * paramLen))*100.0; //Assuming that this can be handled as a number, might need to be BigInt
      } else if (item.status === "running" || item.status === "pending") {
        item.performance_index = item.value / 2.0;
      } // "failed" state is implictly handled by performance_index defaulting to 0

      return item;
    });
    return { data: AugData, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: `Failed to augment data: ${error.message}` };
    }
    return { data: null, error: "An unknown error occurred while augmenting data." };
  }
}

// This is the table/tabular representation of the data. 
// Handling of improper data format is not done here, instead the loading functions should throw errors if the data doesn't conform.
// That the data is null is somewhat expected as a result of an "error" state, so that is handled here.
export function ExportTableElement({data}: {data: AppDataAug | null}) {
  if (data === null) {
    return <div>No data available</div>;
  }
  // Styling for the table is somewhat handled here, most of it by default by the MUI library, and some by the CSS file.
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'timestamp', headerName: 'Timestamp', width: 160 },
    { field: 'value', headerName: 'Value', width: 100 },
    { field: 'parameter_set', headerName: 'Parameter Set', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'performance_index', headerName: 'Performance Index', width: 100 },
  ];
  const paginationModel = { page: 0, pageSize: 10 };
  const rows: AppDataAug = data.map((item: AppDataItemAug) => (
    {
    id: item.id,
    timestamp: new Date(item.timestamp).toLocaleString(),
    value: item.value,
    parameter_set: item.parameter_set,
    status: item.status,
    performance_index: Number(item.performance_index.toFixed(2)), 
  }));
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        checkboxSelection
        showToolbar
      />
    </div>
  );
}

// This is the button to load the data. As we wish for augmented data, the augmented data function handles the reading of the data as well.
export function RawLoadButtonElement({setData }: {setData: React.Dispatch<React.SetStateAction<AppDataAug | null>> }) {
  const handleLoadData = async () => {
    const result = await AugmentData_PerformanceIndex();
    if (result.error) {
      return (
        <button onClick={handleLoadData}>
          Error
        </button>
      );
    } else {
      setData(result.data);
    }

  };
  return (
    <button onClick={handleLoadData}>
      Load Data
    </button>
  );
}
// This is the bar chart representation of the count of the various states/statuses.
// Handling of improper data format is not done here, instead the loading functions should throw errors if the data doesn't conform.
// That the data is null is somewhat expected as a result of an "error" state, so that is handled here.
export function ExportBarChartElement({chartData}: {chartData: AppDataAug | null}) {
  if (chartData === null) {
    return <div>No data available</div>;
  }
  var statusTypes = chartData.map((item: AppDataItemAug) => item.status);
  var statusCounts = statusTypes.reduce((acc: { [key: string]: number }, status: string) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  var data: Data[] = [
    {
      x: Object.keys(statusCounts),
      y: Object.values(statusCounts),
      type: 'bar' as const
    }
  ];
  // Some of the layout of the chart is handled here, most by Plotly, and some by the CSS file.
  const layout: Partial<Layout> = {
    width: 700, 
    height: 450, 
    margin: { t: 50, b: 50, l: 50, r: 50 }, 
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };
  
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }} 
    />
  );
}


