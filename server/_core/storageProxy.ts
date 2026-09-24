import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Express } from "express";
import { ENV } from "./env";

let cachedClient: S3Client | undefined;

function getS3Client(): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: ENV.s3Region,
      endpoint: ENV.s3Endpoint || undefined,
      forcePathStyle: ENV.s3ForcePathStyle,
      credentials: {
        accessKeyId: ENV.s3AccessKeyId,
        secretAccessKey: ENV.s3SecretAccessKey,
      },
    });
  }
  return cachedClient;
}

/**
 * Serves uploaded files at /files/{key} by redirecting to a short-lived
 * presigned S3 GET URL. Only used when S3_PUBLIC_BASE_URL is not set (i.e.
 * the bucket isn't directly public) — see server/storage.ts.
 */
export function registerStorageProxy(app: Express) {
  app.get("/files/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.s3Bucket || !ENV.s3AccessKeyId || !ENV.s3SecretAccessKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const url = await getSignedUrl(
        getS3Client(),
        new GetObjectCommand({ Bucket: ENV.s3Bucket, Key: key }),
        { expiresIn: 300 }
      );

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
