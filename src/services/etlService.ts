import { readCsvFile } from '../utils/excelUtils';
import { upsertEggRowData } from '../utils/sqlUtils';
import { EggRowData } from '../types/data';

export async function runCountingEggRowETL(aviIds: number[], targetDate: string): Promise<string> {
  try {
    // Array to collect all rows from all files
    let allRows: EggRowData[] = [];

    // Process each Excel file
    for (const aviId of aviIds) {
      const rows: EggRowData[] = await readCsvFile(aviId, targetDate); // Pass targetDate
      console.log(`Transformed Data from ${aviId} for date ${targetDate}:`, rows);
      allRows = allRows.concat(rows); // Combine rows from this file
    }

    // Load all rows into SQL Server at once
    if (allRows.length > 0) {
      await upsertEggRowData(allRows);
    } else {
      console.log(`No data to load for date ${targetDate}.`);
    }

    return `CountingPipe ETL completed successfully for ${aviIds.length} file(s) with target date ${targetDate}!`;
  } catch (error) {
    console.error('CountingPipe ETL failed:', error);
    throw error;
  }
}
