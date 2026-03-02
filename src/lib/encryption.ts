import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Get the 32-byte encryption key from ENCRYPTION_KEY env var (hex-encoded).
 * Falls back to a deterministic key derived from CLERK_SECRET_KEY if not set.
 */
function getKey(): Buffer {
    const envKey = process.env.ENCRYPTION_KEY;
    if (envKey && envKey.length === 64) {
        return Buffer.from(envKey, "hex");
    }
    // Fallback: derive from Clerk secret (not ideal but works for dev)
    const fallback = process.env.CLERK_SECRET_KEY || "default-dev-key-do-not-use-in-production";
    const { createHash } = require("crypto");
    return createHash("sha256").update(fallback).digest();
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns: base64(iv + ciphertext + authTag)
 */
export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Pack: iv (12) + encrypted (N) + authTag (16)
    const packed = Buffer.concat([iv, encrypted, authTag]);
    return packed.toString("base64");
}

/**
 * Decrypt a base64-encoded AES-256-GCM ciphertext.
 */
export function decrypt(ciphertext: string): string {
    const key = getKey();
    const packed = Buffer.from(ciphertext, "base64");

    const iv = packed.subarray(0, IV_LENGTH);
    const authTag = packed.subarray(packed.length - TAG_LENGTH);
    const encrypted = packed.subarray(IV_LENGTH, packed.length - TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}
