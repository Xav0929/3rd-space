// lib/escpos.ts

function textToBytes(str: string): number[] {
  // Basic Latin + common PH characters; falls back to '?' for unsupported chars
  return Array.from(str).map((ch) => {
    const code = ch.codePointAt(0) || 63;
    return code < 256 ? code : 63;
  });
}

export function buildEscPosReceipt(order: {
  orderNumber: string;
  type: "delivery" | "dine-in" | "takeout";
  tableNumber?: string;
  customerName?: string;
  deliveryAddress?: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  deliveryFee?: number;
  paymentMethod?: string;
}): Uint8Array {
  const ESC = 0x1b;
  const GS = 0x1d;
  const bytes: number[] = [];

  const push = (...b: number[]) => bytes.push(...b);
  const line = (str = "") => {
    push(...textToBytes(str));
    push(0x0a); // \n
  };

  // Init printer
  push(ESC, 0x40);

  // Center align
  push(ESC, 0x61, 0x01);
  // Bold on, double size
  push(ESC, 0x45, 0x01);
  push(GS, 0x21, 0x11);
  line("3RD SPACE");
  push(GS, 0x21, 0x00); // normal size
  push(ESC, 0x45, 0x00); // bold off
  line("OFFICIAL RECEIPT");
  line("--------------------------------");

  // Order number, bold
  push(ESC, 0x45, 0x01);
  line(`#${order.orderNumber}`);
  push(ESC, 0x45, 0x00);

  const now = new Date().toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  line(now);

  const typeLabel =
    order.type === "dine-in"
      ? `DINE-IN  TABLE ${order.tableNumber || "?"}`
      : order.type === "takeout"
        ? "TAKEOUT"
        : "DELIVERY";
  line(typeLabel);

  if (order.customerName) line(order.customerName);

  // Left align for item list
  push(ESC, 0x61, 0x00);
  line("--------------------------------");

  order.items.forEach((it) => {
    const left = `${it.quantity}x ${it.name}`;
    const right = `P${(it.price * it.quantity).toFixed(2)}`;
    const pad = Math.max(1, 32 - left.length - right.length);
    line(left + " ".repeat(pad) + right);
  });

  line("--------------------------------");

  if (order.deliveryFee && order.deliveryFee > 0) {
    const subtotal = order.total - order.deliveryFee;
    const l1 = "Subtotal";
    const r1 = `P${subtotal.toFixed(2)}`;
    line(l1 + " ".repeat(Math.max(1, 32 - l1.length - r1.length)) + r1);
    const l2 = "Delivery fee";
    const r2 = `P${order.deliveryFee.toFixed(2)}`;
    line(l2 + " ".repeat(Math.max(1, 32 - l2.length - r2.length)) + r2);
  }

  // Bold total
  push(ESC, 0x45, 0x01);
  const lT = "TOTAL";
  const rT = `P${order.total.toFixed(2)}`;
  line(lT + " ".repeat(Math.max(1, 32 - lT.length - rT.length)) + rT);
  push(ESC, 0x45, 0x00);

  if (order.paymentMethod) {
    line(`Payment: ${order.paymentMethod.toUpperCase()}`);
  }

  line("--------------------------------");
  push(ESC, 0x61, 0x01); // center
  line("Thank you for visiting!");
  line("3rd Space Cafe - Nueva Ecija");
  line("");
  line("");
  line("");

  // Cut paper
  push(GS, 0x56, 0x42, 0x00);

  return new Uint8Array(bytes);
}

export function escPosToRawBtUrl(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const base64 = btoa(binary);
  return `rawbt:base64,${base64}`;
}
