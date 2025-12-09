import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar Turbopack y usar Webpack para mejor compatibilidad con HMR
  // Turbopack puede tener problemas de caché en desarrollo
  // Si quieres probar Turbopack más adelante, puedes cambiar a: experimental: { turbo: {} }
  
  // Optimizaciones para Hot Module Replacement (HMR)
  reactStrictMode: true,
  
  };

export default nextConfig;
