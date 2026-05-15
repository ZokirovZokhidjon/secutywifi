const express = require('express');
const find = require('local-devices');
const cors = require('cors');
const path = require('path'); // Шу қаторни қўшинг

const app = express();
app.use(cors());

// --- МАНА ШУ ҚИСМНИ ҚЎШИНГ ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// -----------------------------

app.get('/devices', async (req, res) => {
    try {
        const devices = await find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: "Сканерлашда хатолик" });
    }
});

app.listen(3000, () => {
    console.log("Сервер ишламоқда: http://localhost:3000");
});