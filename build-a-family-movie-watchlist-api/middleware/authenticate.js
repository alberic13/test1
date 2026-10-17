import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader =
    req.headers?.authorization ||
    req.headers?.Authorization ||
    (typeof req.get === "function" ? req.get("authorization") : null) ||
    (typeof req.header === "function" ? req.header("authorization") : null);

  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET || "supersecretfamilywatchlistjwtkey12345";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
