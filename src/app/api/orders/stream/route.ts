import { NextRequest } from "next/server";
import { addClient, removeClient } from "@/lib/sse";

export async function GET(req: NextRequest) {
  let controller: ReadableStreamDefaultController;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
      addClient(controller);
      c.enqueue(": connected\n\n");
    },
    cancel() {
      removeClient(controller);
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
