// lib/products.ts

import type { Product } from "@/src/types/product";
import { mockProducts } from "@/src/data/mock-products"; 



//  Obtener TODOS los productos
export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}


//  Obtener un producto por ID (para /producto/[id])
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}


//  Buscar productos por texto (título, marca, tags o descripción)
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const q = query.toLowerCase();

  return products.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}


//  Filtrar productos por categoría (Perro / Gato)
// Usa p.category si existe, o tags si no existe.
export async function getProductsByCategory(category: "perro" | "gato") {
  const products = await getProducts();
  return products.filter(
    (p) => p.category === category || p.tags.includes(category)
  );
}


//  Filtrar productos por marca (marca exacta)
export async function getProductsByBrand(brand: string) {
  const products = await getProducts();
  const brandLower = brand.toLowerCase();

  return products.filter(
    (p) => p.brand.toLowerCase() === brandLower
  );
}