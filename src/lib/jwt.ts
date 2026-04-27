import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

if (process.env.NODE_ENV === "production" && JWT_SECRET === "super-secret-key-change-me") {
  console.warn("WARNING: JWT_SECRET is using default value in production!");
}

export function signToken(payload: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

