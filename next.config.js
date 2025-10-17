/** @type {import('next').NextConfig} */

const normalizeBasePath = (v) => {
  if (!v) return ''
  return v.startsWith('/') ? v : `/${v}`
}

const basePath = normalizeBasePath(process.env.BASE_PATH)

const nextConfig = {
  reactStrictMode: true,
  // Generate a static export suitable for GitHub Pages
  output: 'export',
  // Prefix routes and assets when publishing under /<repo>
  basePath,
  assetPrefix: basePath || '',
  // Not using next/image, but this avoids image optimizer requirements
  images: { unoptimized: true },
  // Expose basePath to the client for helpers
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

module.exports = nextConfig
