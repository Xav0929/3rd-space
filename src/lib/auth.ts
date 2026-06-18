import { createHmac } from "crypto";

const SECRET = process.env.AUTH_SECRET || "3rdspace-change-this-secret";

export function signSession(role: string, displayName: string): string {
  const payload = Buffer.from(`${role}:${displayName}`).toString("base64");
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(
  token: string,
): { role: string; displayName: string } | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expected) return null;
    const decoded = Buffer.from(payload, "base64").toString("utf8");
    const [role, ...rest] = decoded.split(":");
    const displayName = rest.join(":");
    if (!role || !displayName) return null;
    return { role, displayName };
  } catch {
    return null;
  }
}
