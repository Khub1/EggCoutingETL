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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const etlService_1 = require("./services/etlService");
const app = (0, express_1.default)();
const port = 3000;
app.get('/run-etl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hardcoded list of filepaths (replace with your actual files)
        const aviIds = [17, 36];
        // OR: Get filepaths from query parameter, e.g., ?files=data1.xlsx,data2.xlsx
        // const filePaths = req.query.files ? (req.query.files as string).split(',') : ['./data.xlsx'];
        // Get targetDate from query parameter, e.g., ?date=31/7/2022
        const targetDate = req.query.date || '31/7/2022'; // Default to '31/7/2022' if not provided
        const result = yield (0, etlService_1.runCountingEggRowETL)(aviIds, targetDate);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('CountingPipe ETL failed');
    }
}));
app.listen(port, () => {
    console.log(`CountingPipe server running at http://localhost:${port}`);
});
