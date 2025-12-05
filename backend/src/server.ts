// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

// === Log ตอนสตาร์ทว่ามองเห็น ENV ไหม ===
console.log("[BOOT] TTD_API_KEY present:", !!process.env.TTD_API_KEY);
console.log("[BOOT] TTD_API_BASE_URL:", process.env.TTD_API_BASE_URL);
console.log("[BOOT] PORT:", PORT);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
