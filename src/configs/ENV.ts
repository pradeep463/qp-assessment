import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const MODE = process.env.MODE || "localhost";
export const FILE_BASE_URL =
  MODE === "localhost" ? `http://localhost:${PORT}/` : "";
