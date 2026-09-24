export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // S3-compatible object storage (works with AWS S3, SeaweedFS, MinIO, etc.)
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  s3Region: process.env.S3_REGION ?? "us-east-1",
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  // SeaweedFS / MinIO need path-style URLs (http://host/bucket/key) instead
  // of virtual-hosted style (http://bucket.host/key).
  s3ForcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
  // Optional: a public base URL to serve files from directly (e.g. a CDN or
  // a public bucket endpoint). If unset, files are served through the
  // server's /files/* proxy using presigned GET URLs.
  s3PublicBaseUrl: process.env.S3_PUBLIC_BASE_URL ?? "",
};
