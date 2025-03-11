"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.readCsvFile = readCsvFile;
const ExcelJS = __importStar(require("exceljs"));
const sync_1 = require("csv-parse/sync"); // Using sync parsing as per your updated code
const promises_1 = require("fs/promises");
// Mapeo de aviId a path
const aviaryMap = {
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
function readCsvFile(aviId, targetDate) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const filePath = aviaryMap[aviId];
        if (!filePath) {
            console.error(`No se encontró un archivo para aviId: ${aviId}`);
            return [];
        }
        const workbook = new ExcelJS.Workbook();
        try {
            console.log(`Attempting to read file: ${filePath}`);
            // Read the CSV file content
            const csvContent = yield (0, promises_1.readFile)(filePath, 'utf-8');
            console.log('File read successfully');
            // Parse CSV with semicolon delimiter
            const records = (0, sync_1.parse)(csvContent, {
                delimiter: ';',
                columns: false, // Do not treat the first row as headers
                skipEmptyLines: true,
            });
            const worksheet = workbook.addWorksheet('Sheet1');
            records.forEach((row, index) => {
                worksheet.addRow(row);
            });
            console.log(`Worksheet name: ${worksheet.name}`);
            const actualRecords = [];
            // Map column headers (columns G to BB, i.e., 7 to 54)
            const columnMappings = {};
            console.log('Parsing headers...');
            const headerRow1 = worksheet.getRow(1).values;
            const headerRow2 = worksheet.getRow(2).values;
            const headerRow3 = worksheet.getRow(3).values;
            for (let colNumber = 7; colNumber <= 54; colNumber++) {
                const filaCell = (_a = headerRow1[colNumber]) === null || _a === void 0 ? void 0 : _a.toString().trim();
                const pisoCell = (_b = headerRow2[colNumber]) === null || _b === void 0 ? void 0 : _b.toString().trim();
                const ladoCell = (_c = headerRow3[colNumber]) === null || _c === void 0 ? void 0 : _c.toString().trim();
                const filaMatch = filaCell === null || filaCell === void 0 ? void 0 : filaCell.match(/fila\s*(\d+)/i);
                const columna = filaMatch ? filaMatch[1] : null;
                const pisoMatch = pisoCell === null || pisoCell === void 0 ? void 0 : pisoCell.match(/piso\s*(\d+)/i);
                const piso = pisoMatch ? pisoMatch[1] : null;
                const ladoMatch = ladoCell === null || ladoCell === void 0 ? void 0 : ladoCell.match(/izquierda|derecha/i);
                const lado = ladoMatch ? ladoMatch[0].toLowerCase() : null;
                if (columna && piso && lado) {
                    const fila = `${columna}${lado === 'izquierda' ? '1' : '2'}${piso}`;
                    columnMappings[colNumber] = parseInt(fila);
                }
                else {
                    console.log(`Skipping column ${colNumber} due to missing or invalid header data`);
                }
            }
            console.log(`Processing data rows for target date: ${targetDate}...`);
            for (let rowNumber = 4; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                const fechaCell = (_d = row.getCell(1).value) === null || _d === void 0 ? void 0 : _d.toString().trim();
                const fecha = (fechaCell === null || fechaCell === void 0 ? void 0 : fechaCell.split(';')[0]) || ''; // Extract the date part
                if (fecha === targetDate) {
                    Object.entries(columnMappings).forEach(([col, rghuevos_fila]) => {
                        var _a;
                        const cellValue = (_a = row.getCell(parseInt(col)).value) === null || _a === void 0 ? void 0 : _a.toString().trim();
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
        }
        catch (error) {
            console.error('Error processing file:', error);
            throw error;
        }
    });
}
