// app/api/sse/route.ts
// Server-Sent Events (SSE) endpoint for real-time notification pushes.
// When an employer updates an application status, candidates connected here
// receive a live "notification" event without polling.

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-process registry: userId → set of SSE response controllers
type Controller = ReadableStreamDefaultController<Uint8Array>;
const clients = new Map<string, Set<Controller>>();

export function addClient(userId: string, controller: Controller) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId)!.add(controller);
}

export function removeClient(userId: string, controller: Controller) {
  clients.get(userId)?.delete(controller);
}

/**
 * Send a JSON event to all connected SSE clients for a user.
 * Called by the status-update API after writing a notification.
 */
export function pushToUser(userId: string, payload: object) {
  const userClients = clients.get(userId);
  if (!userClients) return;
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  const encoded = new TextEncoder().encode(message);
  for (const ctrl of userClients) {
    try {
      ctrl.enqueue(encoded);
    } catch {
      // Client disconnected — will be cleaned up by the cancel handler
    }
  }
}

/**
 * GET /api/sse
 * Opens an SSE stream for the authenticated user.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  let controller: Controller | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      controller = ctrl;
      addClient(userId, controller);

      // Send an initial "connected" heartbeat
      const hello = new TextEncoder().encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
      ctrl.enqueue(hello);
    },
    cancel() {
      if (controller) removeClient(userId, controller);
    },
  });

  // Keep-alive ping every 25 seconds so proxies don't close the connection
  const pingInterval = setInterval(() => {
    if (controller) {
      try {
        controller.enqueue(new TextEncoder().encode(': ping\n\n'));
      } catch {
        clearInterval(pingInterval);
      }
    }
  }, 25_000);

  req.signal.addEventListener('abort', () => {
    clearInterval(pingInterval);
    if (controller) removeClient(userId, controller);
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx buffering
    },
  });
}
