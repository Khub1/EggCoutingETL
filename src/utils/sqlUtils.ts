import * as sql from 'mssql';
import { sqlConfig } from '../config/dbConfig';
import { EggRowData } from '../types/data';

export async function upsertEggRowData(rows: EggRowData[]): Promise<void> {
  const pool = await sql.connect(sqlConfig);
  try {
    for (const row of rows) {
      const check = await pool.request()
        .input('rghuevos_fecha', sql.NVarChar, row.rghuevos_fecha)
        .input('rghuevos_fila', sql.Int, row.rghuevos_fila)
        .query(`
          SELECT COUNT(*) as count
          FROM PipeCounts
          WHERE rghuevos_fecha = @rghuevos_fecha 
          AND rghuevos_fila = @rghuevos_fila
        `);

      if (check.recordset[0].count > 0) {
        await pool.request()
          .input('rghuevos_fecha', sql.NVarChar, row.rghuevos_fecha)
          .input('rghuevos_fila', sql.Int, row.rghuevos_fila)
          .input('rghuevos_huevos', sql.Int, row.rghuevos_huevos)
          .query(`
            UPDATE PipeCounts 
            SET rghuevos_huevos = @rghuevos_huevos 
            WHERE rghuevos_fecha = @rghuevos_fecha 
            AND rghuevos_fila = @rghuevos_fila
          `);
        console.log(`Updated pipe data for date ${row.rghuevos_fecha} and row ${row.rghuevos_fila}`);
      } else {
        await pool.request()
          .input('rghuevos_fecha', sql.NVarChar, row.rghuevos_fecha)
          .input('rghuevos_fila', sql.Int, row.rghuevos_fila)
          .input('rghuevos_huevos', sql.Int, row.rghuevos_huevos)
          .query(`
            INSERT INTO PipeCounts (rghuevos_fecha, rghuevos_fila, rghuevos_huevos)
            VALUES (@rghuevos_fecha, @rghuevos_fila, @rghuevos_huevos)
          `);
        console.log(`Inserted new pipe data for date ${row.rghuevos_fecha} and row ${row.rghuevos_fila}`);
      }
    }
  } finally {
    await pool.close();
  }
}


