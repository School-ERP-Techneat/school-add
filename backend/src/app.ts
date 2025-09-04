import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Route imports
import schoolRoutes from "./routes/school.routes";
import adminRoutes from "./routes/admin.routes";
import teacherRoutes from "./routes/teacher.routes";
import studentModuleRoutes from "./routes/student.routes";
import schoolOwnerRoutes from "./routes/schoolOwner.routes";
import classRoutes from "./routes/class.routes";
import batchRoutes from "./routes/batch.routes";
import sectionRoutes from "./routes/section.routes";
import attendanceRoutes from "./routes/attendance.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "https://marvel-his-violence-bow.trycloudflare.com", // Frontend 1
      "https://chief-medical-leo-deadline.trycloudflare.com" // Frontend 2
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // Allow cookies, authorization headers
    maxAge: 86400, // Optional: cache preflight request for 24 hours
  })
);


// Api Endpoint to Health Check Backend
app.use("/api/health-status", (req, res) => {
  res.send("Service is live");
});

// Using Routes
app.use("/api/school", schoolRoutes);
app.use("/api/school-owner", schoolOwnerRoutes);
app.use("/api/admin/:schoolCode", adminRoutes);
app.use("/api/teacher/:schoolCode", teacherRoutes);
app.use("/api/student/:schoolCode", studentModuleRoutes);
app.use("/api/class/:schoolCode", classRoutes);
app.use("/api/batch/:schoolCode", batchRoutes);
app.use("/api/section/:schoolCode", sectionRoutes);
app.use("/api/attendance/:schoolCode", attendanceRoutes);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          // Unique constraint failed
          message = `A record with this ${err.meta?.target} already exists.`;
          statusCode = 400;
          break;
        case "P2003":
          // Foreign key constraint failed
          message = `Invalid reference: related record not found. (${err.meta?.constraint})`;
          statusCode = 400;
          break;
        case "P2025":
          // Record not found
          message = `The record you tried to update/delete does not exist.`;
          statusCode = 404;
          break;
        default:
          message = "Database error occurred.";
          statusCode = 500;
      }
    }
    res.status(statusCode).json({
      message: message,
      error: process.env.NODE_ENV === "production" ? {} : err,
    });
  }
);

export default app;
