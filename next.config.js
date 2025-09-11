/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sazu.ge"], // ვამატებთ sazu.ge-ს სანდო დომენების სიაში
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // ნიშნავს, რომ ამ დომენზე ნებისმიერი სურათი ხელმისაწვდომია
      },
    ],
  },
};

module.exports = nextConfig;
