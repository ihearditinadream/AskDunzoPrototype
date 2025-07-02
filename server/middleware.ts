import type { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    
    const record = requestCounts.get(key);
    
    if (!record || record.resetTime < now) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ 
        message: "Too many requests. Please try again later." 
      });
    }
    
    record.count++;
    next();
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  requestCounts.forEach((record, key) => {
    if (record.resetTime < now) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => requestCounts.delete(key));
}, 60000); // Clean up every minute

// Validation middleware for request bodies
export function validateBody(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.errors,
      });
    }
    req.body = result.data;
    next();
  };
}

// Sanitize user input to prevent XSS
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic HTML entity encoding
      return obj
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  next();
}