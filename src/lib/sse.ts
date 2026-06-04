const clients = new Set<ReadableStreamDefaultController>();

export function addClient(c: ReadableStreamDefaultController) {
  clients.add(c);
}

export function removeClient(c: ReadableStreamDefaultController) {
  clients.delete(c);
}

export function notifyClients() {
  clients.forEach((c) => {
    try {
      c.enqueue("data: refresh\n\n");
    } catch {
      clients.delete(c);
    }
  });
}
