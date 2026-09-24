"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
exports.ENV = {
    cookieSecret: (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "",
    databaseUrl: (_b = process.env.DATABASE_URL) !== null && _b !== void 0 ? _b : "",
    isProduction: process.env.NODE_ENV === "production",
    // S3-compatible object storage (works with AWS S3, SeaweedFS, MinIO, etc.)
    s3Endpoint: (_c = process.env.S3_ENDPOINT) !== null && _c !== void 0 ? _c : "",
    s3Region: (_d = process.env.S3_REGION) !== null && _d !== void 0 ? _d : "us-east-1",
    s3Bucket: (_e = process.env.S3_BUCKET) !== null && _e !== void 0 ? _e : "",
    s3AccessKeyId: (_f = process.env.S3_ACCESS_KEY_ID) !== null && _f !== void 0 ? _f : "",
    s3SecretAccessKey: (_g = process.env.S3_SECRET_ACCESS_KEY) !== null && _g !== void 0 ? _g : "",
    // SeaweedFS / MinIO need path-style URLs (http://host/bucket/key) instead
    // of virtual-hosted style (http://bucket.host/key).
    s3ForcePathStyle: ((_h = process.env.S3_FORCE_PATH_STYLE) !== null && _h !== void 0 ? _h : "true") === "true",
    // Optional: a public base URL to serve files from directly (e.g. a CDN or
    // a public bucket endpoint). If unset, files are served through the
    // server's /files/* proxy using presigned GET URLs.
    s3PublicBaseUrl: (_j = process.env.S3_PUBLIC_BASE_URL) !== null && _j !== void 0 ? _j : "",
};
