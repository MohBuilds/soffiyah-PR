const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'dist');
http.createServer((req,res)=>{const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html; charset=utf-8');res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
