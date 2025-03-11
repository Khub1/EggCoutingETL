import * as ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync'; // Using sync parsing as per your updated code
import { readFile } from 'fs/promises';
import { EggRowData } from '../types/data';

// Mapeo de aviId a path
const aviaryMap: { [key: number]: string } = {
    15: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_002.csv",
    16: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_003.csv",
    17: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_004.csv",
    18: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_005.csv",
    19: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_006.csv",
    20: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_007.csv",
    21: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_41\\ASCII\\EggRowTierTable_OR_ES_v00_008.csv",
    22: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_20\\ASCII\\EggRowTierTable_OR_ES_v00_009.csv",
    23: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_20\\ASCII\\EggRowTierTable_OR_ES_v00_010.csv",
    24: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_20\\ASCII\\EggRowTierTable_OR_ES_v00_011.csv",
    25: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_20\\ASCII\\EggRowTierTable_OR_ES_v00_012.csv",
    26: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_002.csv",
    27: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_003.csv",
    28: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_004.csv",
    29: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_005.csv",
    30: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_006.csv",
    31: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_007.csv",
    32: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_25\\ASCII\\EggRowTierTable_OR_ES_v00_008.csv",
    33: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_26\\ASCII\\EggRowTierTable_OR_ES_v00_009.csv",
    34: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_26\\ASCII\\EggRowTierTable_OR_ES_v00_010.csv",
    35: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_26\\ASCII\\EggRowTierTable_OR_ES_v00_011.csv",
    36: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_35\\ASCII\\EggRowTierTable_OR_PL_v00_001.csv",
    37: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_5\\ASCII\\EggRowTierTable_OR_PL_v00_002.csv",
    38: "C:\\Users\\ksanchez\\Desktop\\Docs\\CSV contadores\\Link_7\\ASCII\\EggRowTierTable_OR_PL_v00_003.csv"
};

export async function readCsvFile(aviId: number, targetDate: string): Promise<EggRowData[]> {
  const filePath = aviaryMap[aviId];

  if (!filePath) {
    console.error(`No se encontró un archivo para aviId: ${aviId}`);
    return [];
  }

  const workbook = new ExcelJS.Workbook();
  try {
    console.log(`Attempting to read file: ${filePath}`);

    // Read the CSV file content
    const csvContent = await readFile(filePath, 'utf-8');
    console.log('File read successfully');

    // Parse CSV with semicolon delimiter
    const records = parse(csvContent, {
      delimiter: ';',
      columns: false, // Do not treat the first row as headers
      skipEmptyLines: true,
    });

    const worksheet = workbook.addWorksheet('Sheet1');
    records.forEach((row: any, index: number) => {
      worksheet.addRow(row);
    });

    console.log(`Worksheet name: ${worksheet.name}`);

    const actualRecords: EggRowData[] = [];

    // Map column headers (columns G to BB, i.e., 7 to 54)
    const columnMappings: { [key: number]: number } = {};

    console.log('Parsing headers...');
    const headerRow1 = worksheet.getRow(1).values as string[];
    const headerRow2 = worksheet.getRow(2).values as string[];
    const headerRow3 = worksheet.getRow(3).values as string[];

    for (let colNumber = 7; colNumber <= 54; colNumber++) {
      const filaCell = headerRow1[colNumber]?.toString().trim();
      const pisoCell = headerRow2[colNumber]?.toString().trim();
      const ladoCell = headerRow3[colNumber]?.toString().trim();

      const filaMatch = filaCell?.match(/fila\s*(\d+)/i);
      const columna = filaMatch ? filaMatch[1] : null;

      const pisoMatch = pisoCell?.match(/piso\s*(\d+)/i);
      const piso = pisoMatch ? pisoMatch[1] : null;

      const ladoMatch = ladoCell?.match(/izquierda|derecha/i);
      const lado = ladoMatch ? ladoMatch[0].toLowerCase() : null;

      if (columna && piso && lado) {
        const fila = `${columna}${lado === 'izquierda' ? '1' : '2'}${piso}`;
        columnMappings[colNumber] = parseInt(fila);
      } else {
        console.log(`Skipping column ${colNumber} due to missing or invalid header data`);
      }
    }

    console.log(`Processing data rows for target date: ${targetDate}...`);
    for (let rowNumber = 4; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const fechaCell = row.getCell(1).value?.toString().trim();
      const fecha = fechaCell?.split(';')[0] || ''; // Extract the date part

      if (fecha === targetDate) {
        Object.entries(columnMappings).forEach(([col, rghuevos_fila]) => {
          const cellValue = row.getCell(parseInt(col)).value?.toString().trim();
          const huevos = parseFloat(cellValue || '0');
          if (huevos && !isNaN(huevos)) {
            actualRecords.push({
              rghuevos_fecha: fecha,
              rghuevos_id_aviario: aviId,
              rghuevos_fila,
              rghuevos_huevos: huevos,
            });
          }
        });
      }
    }

    console.log('Datos extraídos:', actualRecords);
    return actualRecords;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
}






