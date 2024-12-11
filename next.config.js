/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add a rule for handling .node files
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig
