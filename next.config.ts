import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar Turbopack y usar Webpack para mejor compatibilidad con HMR
  // Turbopack puede tener problemas de caché en desarrollo
  // Si quieres probar Turbopack más adelante, puedes cambiar a: experimental: { turbo: {} }
  
  // Optimizaciones para Hot Module Replacement (HMR)
  reactStrictMode: true,
  
  // Configuración de webpack para mejorar HMR
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimizar HMR en desarrollo
      config.watchOptions = {
        poll: 1000, // Verificar cambios cada segundo
        aggregateTimeout: 300, // Esperar 300ms antes de recompilar
        ignored: /node_modules/, // Ignorar node_modules
      };
      
      // Mejorar el rendimiento de HMR
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
    return config;
  },
  
  // Configuración experimental (sin Turbopack por defecto)
  experimental: {
    // No habilitar Turbopack por ahora para evitar problemas de caché
    // turbo: {}, // Descomentar solo si quieres probar Turbopack explícitamente
  },
  
  // Configuración de compilación
  compiler: {
    // Mantener nombres de funciones para mejor debugging en HMR
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
