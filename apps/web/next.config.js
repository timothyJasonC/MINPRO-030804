/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        //   {
        //     protocol: "https",
        //     hostname: "**",
        //   },
          {
            protocol: "http",
            hostname: "**",
          },
        ],
      },
      env: {
        BASE_URL: "https://sure-just-goat.ngrok-free.app"
      }
}

module.exports = nextConfig
