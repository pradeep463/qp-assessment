import express, { Express, Request, Response } from "express";
import { PORT } from "./configs/ENV";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import cors from "cors";
import fs from "fs";
import { allRoutes } from "./routes/allRoutes";
import multer from "multer";

const router = express.Router();
const app: Express = express();

const isExistUploadDirectory = (req: Request, res: Response, next: any) => {
  const uploadsDir = "./uploads";
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  next();
};

app.use(isExistUploadDirectory);

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(logger);

app.use(errorHandler);

allRoutes.forEach((route) => {
  console.log(route.path);
  if (route.method === "GET") {
    app.get(route.path, route.handler);
  } else if (route.method === "POST" && route.isFileUpload) {
    app.post(route.path, upload.any(), route.handler);
  } else if (route.method === "POST") {
    app.post(route.path, route.handler);
  } else if (route.method === "DELETE") {
    app.delete(route.path, route.handler);
  } else if (route.method === "PUT") {
    app.put(route.path, route.handler);
  }
});

// allRoutes.forEach((route) => {
//   console.log(route.path);
//   if (route.method === "get") {
//     router.get(route.path, route.handler);
//   }
// });

app.listen(PORT, () => {
  console.log(`[server]: Server is running at ${PORT}`);
});
