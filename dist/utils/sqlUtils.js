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
exports.upsertEggRowData = upsertEggRowData;
const sql = __importStar(require("mssql"));
const dbConfig_1 = require("../config/dbConfig");
function upsertEggRowData(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield sql.connect(dbConfig_1.sqlConfig);
        try {
            for (const row of rows) {
                const check = yield pool.request()
                    .input('rghuevos_fecha', sql.NVarChar, row.rghuevos_fecha)
                    .input('rghuevos_fila', sql.Int, row.rghuevos_fila)
                    .query(`
          SELECT COUNT(*) as count
          FROM PipeCounts
          WHERE rghuevos_fecha = @rghuevos_fecha 
          AND rghuevos_fila = @rghuevos_fila
        `);
                if (check.recordset[0].count > 0) {
                    yield pool.request()
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
                }
                else {
                    yield pool.request()
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
        }
        finally {
            yield pool.close();
        }
    });
}
