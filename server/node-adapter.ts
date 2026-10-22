import type { IncomingMessage, ServerResponse } from 'node:http';
import { LIMITS } from '../src/lib/inquiry';

/** Converts a Node request into a Fetch API Request, capping the body size. */
export async function nodeToWebRequest(req: IncomingMessage, origin: string): Promise<Request> {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
    else if (v !== undefined) headers.set(k, v);
  }
  if (!headers.has('x-forwarded-for') && req.socket.remoteAddress) headers.set('x-forwarded-for', req.socket.remoteAddress);
  const method = req.method ?? 'GET';
  let body: string | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += (chunk as Buffer).length;
      // Read a little past the limit so the handler can reply 413 instead of hanging.
      if (size > LIMITS.requestBytes * 2) break;
      chunks.push(chunk as Buffer);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  return new Request(new URL(req.url ?? '/', origin), { method, headers, body });
}

export async function sendWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
