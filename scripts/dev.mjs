import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const PORT = 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let reqUrl = (req.url || '/').split('?')[0];

  if (reqUrl === '/' || reqUrl === '') {
    res.writeHead(302, { Location: '/preview/' });
    res.end();
    return;
  }

  if (reqUrl === '/preview') {
    res.writeHead(301, { Location: '/preview/' });
    res.end();
    return;
  }

  if (reqUrl.endsWith('/')) {
    reqUrl += 'index.html';
  }

  const filePath = path.join(rootDir, reqUrl);

  // Prevent directory traversal
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n  🚀 iconmoji dev server running`);
  console.log(`  ➜ Local:   http://localhost:${PORT}/preview/\n`);
});

// Start tsup in watch mode
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';
const tsup = spawn(npxCmd, ['tsup', '--watch', 'src', '--onSuccess', 'node scripts/copy-css.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
});

tsup.on('error', (err) => {
  console.error('Failed to start tsup:', err);
});

function cleanup() {
  server.close();
  tsup.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
