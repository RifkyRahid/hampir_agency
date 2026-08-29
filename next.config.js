const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
let baseHost = ''
try {
  baseHost = new URL(baseUrl).host
} catch (e) {
  baseHost = ''
}

// Allow Server Actions & dev asset requests from the preview proxy hosts.
// Next's wildcard `*` only matches a single label, so we generate patterns
// for multiple subdomain depths of the known preview domains.
const previewDomains = ['emergentagent.com', 'emergentcf.cloud', 'emergent.host']
const wildcardOrigins = []
for (const domain of previewDomains) {
  for (let depth = 1; depth <= 5; depth++) {
    wildcardOrigins.push('*.'.repeat(depth) + domain)
  }
}
const allowedOrigins = [baseHost, ...wildcardOrigins].filter(Boolean)

const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: allowedOrigins,
  experimental: {
    serverActions: {
      allowedOrigins,
      bodySizeLimit: '15mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  // Renamed from experimental.serverComponentsExternalPackages in Next 15
  serverExternalPackages: ['mongodb'],
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
