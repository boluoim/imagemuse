import crypto from "crypto";
import path from "path";

export function generateFileName(originalName: string, keepOriginalName = false): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || '';
  
  if (keepOriginalName) {
    const nameWithoutExt = originalName.slice(0, -(extension.length + 1));
    return `${nameWithoutExt}-${timestamp}.${extension}`;
  }
  
  return `${timestamp}.${extension}`;
}

export function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp"
  };
  
  return contentTypes[ext] || "application/octet-stream";
}

export function validateFileSize(size: number): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return size <= MAX_SIZE;
} 