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
exports.runCountingEggRowETL = runCountingEggRowETL;
const excelUtils_1 = require("../utils/excelUtils");
const sqlUtils_1 = require("../utils/sqlUtils");
function runCountingEggRowETL(aviIds, targetDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Array to collect all rows from all files
            let allRows = [];
            // Process each Excel file
            for (const aviId of aviIds) {
                const rows = yield (0, excelUtils_1.readCsvFile)(aviId, targetDate); // Pass targetDate
                console.log(`Transformed Data from ${aviId} for date ${targetDate}:`, rows);
                allRows = allRows.concat(rows); // Combine rows from this file
            }
            // Load all rows into SQL Server at once
            if (allRows.length > 0) {
                yield (0, sqlUtils_1.upsertEggRowData)(allRows);
            }
            else {
                console.log(`No data to load for date ${targetDate}.`);
            }
            return `CountingPipe ETL completed successfully for ${aviIds.length} file(s) with target date ${targetDate}!`;
        }
        catch (error) {
            console.error('CountingPipe ETL failed:', error);
            throw error;
        }
    });
}
