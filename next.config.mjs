/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Remove these ignores if possible, address the underlying errors instead
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
   transpilePackages: [
    "@salt-ds/core",
    "@salt-ds/lab",
    "@salt-ds/icons",
    "@salt-ds/theme",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
