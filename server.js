const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const allowedOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const server = http.createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigin.test(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else if (origin) {
    response.writeHead(403);
    response.end('Forbidden origin');
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && requestUrl.pathname === '/api/stations') {
    const token = process.env.NOAA_TOKEN;
    if (!token) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'NOAA_TOKEN is not configured' }));
      return;
    }

    try {
      const upstreamUrl = new URL('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations');
      upstreamUrl.search = requestUrl.search;
      const upstream = await fetch(upstreamUrl, {
        headers: { token },
        signal: AbortSignal.timeout(15000),
      });
      const body = await upstream.text();
      response.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      });
      response.end(body);
    } catch (error) {
      response.writeHead(502, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'NOAA request failed' }));
    }
    return;
  }

    if (request.method === 'GET' && requestUrl.pathname === '/api/datasets') {
    const token = process.env.NOAA_TOKEN;
    if (!token) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'NOAA_TOKEN is not configured' }));
      return;
    }

    try {
      const upstreamUrl = new URL('https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets');
      upstreamUrl.search = requestUrl.search;
      const upstream = await fetch(upstreamUrl, {
        headers: { token },
        signal: AbortSignal.timeout(15000),
      });
      const body = await upstream.text();
      response.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      });
      response.end(body);
    } catch (error) {
      response.writeHead(502, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'NOAA request failed' }));
    }
    return;
  }

  if (request.method === 'GET' && ['/', '/index.html', '/src.js'].includes(requestUrl.pathname)) {
    const fileName = requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname.slice(1);
    const contentType = fileName.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
    try {
      const content = await readFile(path.join(root, fileName));
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
    return;
  }

  response.writeHead(404);
  response.end('Not found');
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${port}`);
});