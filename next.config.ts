import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/salon-form/:path*",
        destination: "/book?location=salon",
        permanent: true,
      },
      {
        source: "/mobile-form/:path*",
        destination: "/book?location=mobile",
        permanent: true,
      },
      {
        source: "/elementor-1059/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/rl_gallery/:path*",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
