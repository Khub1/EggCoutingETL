import { readCsvFile } from '../utils/excelUtils'; // Ajusta la ruta de acuerdo a tu estructura

async function testReadExcel() {
  try {
    console.log('Leyendo archivo de Excel...');
    const aviId = 36
    const targetDate = '31/7/2022';  // Especifica la fecha objetivo que deseas filtrar
    const extractedData = await readCsvFile(aviId, targetDate);
    
    console.log(`Datos extraídos del archivo de Excel para la fecha ${targetDate}:`);
    console.log(extractedData);
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
  }
}

// Ejecutar la función de prueba
testReadExcel();
