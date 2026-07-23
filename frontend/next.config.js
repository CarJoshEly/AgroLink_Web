/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cuando la API externa / Supabase Storage esté lista, agregar aquí
    // el dominio real desde donde se sirvan las imágenes de productos y perfiles.
    remotePatterns: [
      // { protocol: 'https', hostname: 'xxxx.supabase.co' },
    ],
  },
};

module.exports = nextConfig;
