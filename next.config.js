/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable Next.js image optimization in development to avoid proxy 500 errors
    // Set to `true` in development; in production the optimizer can be enabled.
    unoptimized: process.env.NODE_ENV !== 'production',
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // ========================================
  // SECURITY: Content Security Policy (CSP)
  // Allows Paddle, PayPal Checkout, and Local Development
  // ========================================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://*.paddle.com https://public.profitwell.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com https://*.paypal.com https://*.ngrok-free.app https://*.ngrok.app https://*.ngrok-free.dev https://*.loca.lt",
              "style-src 'self' 'unsafe-inline' https://cdn.paddle.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https: fonts.gstatic.com",
              "connect-src 'self' https://cdn.paddle.com https://*.paddle.com https://public.profitwell.com https://www.paypal.com https://www.sandbox.paypal.com https://api.sandbox.paypal.com https://api.paypal.com https://*.paypal.com https://*.ngrok-free.app https://*.ngrok.app https://*.ngrok-free.dev https://*.loca.lt",
              "frame-src 'self' https://cdn.paddle.com https://buy.paddle.com https://sandbox-buy.paddle.com https://checkout.paddle.com https://*.paddle.com https://public.profitwell.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com https://*.paypal.com https://*.ngrok-free.app https://*.ngrok.app https://*.ngrok-free.dev https://*.loca.lt",
              "frame-ancestors 'self' https://cdn.paddle.com https://buy.paddle.com https://sandbox-buy.paddle.com https://checkout.paddle.com https://*.paddle.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com https://*.paypal.com http://localhost:* http://127.0.0.1:* https://*.ngrok.app https://*.ngrok-free.app https://*.ngrok-free.dev https://*.loca.lt",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Allow Tunneling for local development
  experimental: {
    serverActions: {
      allowedOrigins: [
        'nonglandered-irrefrangibly-caridad.ngrok-free.dev',
        'sad-geckos-cheat.loca.lt',
        '*.ngrok-free.dev',
        '*.loca.lt',
        'localhost:3000'
      ]
    }
  }
};

module.exports = nextConfig;