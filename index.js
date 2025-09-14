const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);


const MODULES_PATH = path.join(__dirname, 'modules.json');
let modules = {};
try { modules = JSON.parse(fs.readFileSync(MODULES_PATH, 'utf8')); } catch (e) { console.warn('modules.json not found or invalid.'); }


function randomId() {
const len = 9 + Math.floor(Math.random() * 3);
let s = '';
for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
return s;
}


const SECRET = process.env.ROBL0X_SECRET || process.env.ROBLOX_SECRET || null;


function isRobloxRequest(req) {
const ua = (req.get('User-Agent') || '').toLowerCase();
if (ua.includes('roblox')) return true;
const qSecret = req.query.secret || req.get('x-roblox-secret') || req.get('authorization');
if (SECRET && qSecret && qSecret === SECRET) return true;
return false;
}

app.get('/id/:name', (req, res) => {
const name = req.params.name;
const real = modules[name];
const roblox = isRobloxRequest(req);


if (roblox && real) {
return res.json({ ok: true, source: 'roblox', id: real });
}


return res.json({ ok: true, source: 'public', id: randomId() });
});

app.post('/admin/set', (req, res) => {
const qSecret = req.query.secret || req.get('x-roblox-secret') || req.get('authorization');
app.listen(PORT, () => console.log(`roblox-module-id-proxy listening on ${PORT}`));
