import serverHandler from './dist/server/server.js';
import { serve, file } from 'bun';
import { join } from 'path';
import { statSync } from 'fs';

const server = serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    // Remove query parameters and prevent directory traversal
    const pathname = url.pathname.replace(/\.\./g, '');
    const filePath = join(process.cwd(), 'dist', 'client', pathname);
    
    try {
      // Check if file exists and is not a directory
      const stat = statSync(filePath);
      if (stat.isFile()) {
        return new Response(file(filePath));
      }
    } catch (e) {
      // File does not exist, let the TanStack Start handler deal with it
    }

    return serverHandler.fetch(req);
  },
});

console.log(`Listening on http://localhost:${server.port}`);
