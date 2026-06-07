import { NextRequest, NextResponse } from "next/server";

const locationStore = new Map<
  string,
  { lat: number; lng: number; riderName?: string; updatedAt: number }
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const { lat, lng, riderName } = body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "lat and lng required" },
      { status: 400 },
    );
  }
  locationStore.set(id, { lat, lng, riderName, updatedAt: Date.now() });
  broadcast(id, { type: "location", lat, lng, riderName });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  locationStore.delete(id);
  broadcast(id, { type: "stopped" });
  return NextResponse.json({ ok: true });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const current = locationStore.get(id);
      if (current) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "location", lat: current.lat, lng: current.lng, riderName: current.riderName })}\n\n`,
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
