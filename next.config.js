/** @tyDe {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'firebasestorage.googleapis.com',
              pathname: '**',
            },
          ],
      },
}

module.exports = nextConfig



