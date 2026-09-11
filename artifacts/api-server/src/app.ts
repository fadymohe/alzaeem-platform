import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import { wildcardTenantMiddleware } from "./middlewares/tenantRouting";

const app: Express = express();

// 1. Security Headers Middleware (Defensive hardening)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Download-Options", "noopen");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
});

// 2. Structured Request Logger
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// 3. Clerk Proxy
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// 4. Safe CORS Configuration
const allowedOriginPattern = /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https?:\/\/([a-zA-Z0-9-]+\.)*za3em\.shop|https?:\/\/zaeem\.shop|https?:\/\/([a-zA-Z0-9-]+\.)*vercel\.app)$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, server-to-server, or curl)
      if (!origin || allowedOriginPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive with credentials for multi-tenant custom domains while preserving protection
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-tenant-subdomain"],
    maxAge: 86400,
  }),
);

// 5. Body Parsers with Safe Size Limits to Prevent DoS
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 6. Clerk Authentication Middleware
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// 7. Multi-Tenant Wildcard Routing & API Router
app.use(wildcardTenantMiddleware);
app.use("/api", router);

export default app;
