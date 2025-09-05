import { createApp } from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
