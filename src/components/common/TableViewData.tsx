import React from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, DataGridProps } from "@mui/x-data-grid";
import { TableEmpty } from "./TableEmpty";

interface DocumentTableProps<T>
  extends Omit<DataGridProps, "columns" | "rows"> {
  data: T[];
  defaultColumns: GridColDef[];
  isLoading: boolean;
  height?: number | string;
  noRowsOverlay?: React.ElementType;
}

const TableViewData = <T extends object>({
  data,
  defaultColumns,
  isLoading,
  height = 550,
  noRowsOverlay = TableEmpty,
  ...dataGridProps
}: DocumentTableProps<T>) => {
  return (
    <Box
      className="w-full"
      sx={{
        height,
      }}
    >
      <DataGrid
        sx={{
          
          ".MuiDataGrid-columnHeaderTitle": {
            overflow: "visible !important",
            fontSize: "1.3rem",
            fontWeight: 600,
          },
          ".MuiDataGrid-columnHeader": {
            height: 20
          },
          ".MuiDataGrid-cell": {
            fontSize: "1rem",
            alignContent: "center",
          },
        }}
        rows={data}
        columns={defaultColumns}
        autoPageSize
        rowHeight={43}
        columnHeaderHeight={43}
        pagination
        loading={isLoading}
        slots={{ noRowsOverlay: TableEmpty }}
        {...dataGridProps}
      />
    </Box>
  );
};

export default TableViewData;
