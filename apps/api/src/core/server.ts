import { createApp } from "./app";
import dotenv from "dotenv";
dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
