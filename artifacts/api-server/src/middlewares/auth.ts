import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & { clerkUserId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as AuthenticatedRequest).clerkUserId = userId;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const userId = getAuth(req).userId;
  const adminUserId = process.env.ROOMFLASH_ADMIN_USER_ID;
  if (!userId || !adminUserId || userId !== adminUserId) {
    res.status(403).json({ error: "Admin access is not configured for this account" });
    return;
  }
  (req as AuthenticatedRequest).clerkUserId = userId;
  next();
}

export function getUserId(req: Request): string {
  return (req as AuthenticatedRequest).clerkUserId;
}