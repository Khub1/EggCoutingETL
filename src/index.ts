import express from 'express';
import { runCountingEggRowETL } from './services/etlService';

const app = express();
const port = 3000;

app.get('/run-etl', async (req, res) => {
  try {
    // Hardcoded list of filepaths (replace with your actual files)
    const aviIds = [17, 36];
    // OR: Get filepaths from query parameter, e.g., ?files=data1.xlsx,data2.xlsx
    // const filePaths = req.query.files ? (req.query.files as string).split(',') : ['./data.xlsx'];

    // Get targetDate from query parameter, e.g., ?date=31/7/2022
    const targetDate = req.query.date as string || '31/7/2022'; // Default to '31/7/2022' if not provided

    const result = await runCountingEggRowETL(aviIds, targetDate);
    res.send(result);
  } catch (error) {
    res.status(500).send('CountingPipe ETL failed');
  }
});

app.listen(port, () => {
  console.log(`CountingPipe server running at http://localhost:${port}`);
});