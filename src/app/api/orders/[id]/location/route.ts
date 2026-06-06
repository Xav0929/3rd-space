import { NextRequest, NextResponse } from "next/server";

// In-memory store: orderId → { lat, lng, updatedAt }
// Fine for single-server dev; swap for Redis in prod
const locationStore = new Map<
  string,
  { lat: number; lng: number; updatedAt: number }
>();
const listeners = new Map<string, Set<(data: string) => void>>();

function getListeners(orderId: string) {
  if (!listeners.has(orderId)) listeners.set(orderId, new Set());
  return listeners.get(orderId)!;
}

function broadcast(orderId: string, payload: object) {
  const msg = `data: ${JSON.stringify(payload)}\n\n`;
  getListeners(orderId).forEach((fn) => fn(msg));
}

// POST /api/orders/[id]/location — rider pushes GPS
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const { lat, lng } = body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "lat and lng required" },
      { status: 400 },
    );
  }
  locationStore.set(id, { lat, lng, updatedAt: Date.now() });
  broadcast(id, { type: "location", lat, lng });
  return NextResponse.json({ ok: true });
}

// DELETE /api/orders/[id]/location — rider stops tracking
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  locationStore.delete(id);
  broadcast(id, { type: "stopped" });
  return NextResponse.json({ ok: true });
}

// GET /api/orders/[id]/location — SSE stream for customer
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send current location immediately if available
      const current = locationStore.get(id);
      if (current) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "location", lat: current.lat, lng: current.lng })}\n\n`,
          ),
        );
      } else {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "waiting" })}\n\n`),
        );
      }

      const send = (msg: string) => {
        try {
          controller.enqueue(encoder.encode(msg));
        } catch {}
      };

      getListeners(id).add(send);

      req.signal.addEventListener("abort", () => {
        getListeners(id).delete(send);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
