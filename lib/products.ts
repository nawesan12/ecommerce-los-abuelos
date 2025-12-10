import type { Product } from "@/src/types/product";
import { mockProducts } from "@/src/data/mock-products";

// Transformamos mockProducts para incluir "price" dinámico
export const products: Product[] = mockProducts.map((p) => ({
    ...p,
    price: Math.min(...p.variants.map(v => v.price)) // mínimo precio
}));

// Obtener todos los productos
export async function getProducts() {
  return products;
}

// Obtener un producto por id
export async function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

// Buscar por texto
export async function searchProducts(query: string) {
  const q = query.toLowerCase();
  return products.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q))
  );
}



// Filtrar por categoría
export async function getProductsByCategory(category: "perro" | "gato") {
  return products.filter(
    (p) => p.category === category || p.tags.includes(category)
  );
}

// Filtrar por marca
export async function getProductsByBrand(brand: string) {
  const b = brand.toLowerCase();
  return products.filter((p) => p.brand.toLowerCase() === b);
}