import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "qcpaanr39l6dixw3.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
