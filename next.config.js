/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sazu.ge"], // ვამატებთ sazu.ge-ს სანდო დომენების სიაში
  },
};

module.exports = nextConfig;
