import { readCsvFile } from '../utils/excelUtils'; // Ajusta la ruta de acuerdo a tu estructura

async function testReadExcel() {
  try {
    console.log('Leyendo archivos csv...');
    const extractedData = await readCsvFile();
    
    //console.log(extractedData);
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
  }
}

// Ejecutar la función de prueba
testReadExcel();
