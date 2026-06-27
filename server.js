import serverHandler from './dist/server/server.js';
import { serve } from 'bun';

const server = serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    return serverHandler.fetch(req);
  },
});

console.log(`Listening on http://localhost:${server.port}`);
