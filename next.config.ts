import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@google/generative-ai", "twitter-api-v2"],
};

export default nextConfig;
