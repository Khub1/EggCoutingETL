"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const excelUtils_1 = require("../utils/excelUtils"); // Ajusta la ruta de acuerdo a tu estructura
function testReadExcel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Leyendo archivos csv...');
            const extractedData = yield (0, excelUtils_1.readCsvFile)();
            //console.log(extractedData);
        }
        catch (error) {
            console.error('Error al leer el archivo Excel:', error);
        }
    });
}
// Ejecutar la función de prueba
testReadExcel();
