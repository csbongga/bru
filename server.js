import express from 'express';
import cors from 'cors';
import Papa from 'papaparse';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv42lZ4UDyOqUxjVwowTFDJJFuAvT5XvmIP_90L2r3WAoEtd8TW1wDHmIPKBUpTD6Nu0qNBL-JnLRN/pub?gid=1269439941&single=true&output=csv';

app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                res.json(results.data);
            },
            error: function(error) {
                res.status(500).json({ error: 'Failed to parse CSV data' });
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
