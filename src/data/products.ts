// src/data/products.ts
export type Product = {
  id: string;
  title: string;
  price: number;
  points?: string;
  image: string;
  brand?: string;
  weight?: string;
  description?: string;
};


const baseProducts: Product[] = [
  {
    id: "advance-perro-20kg",
    title: "Alimento Premium Advance Perro Adulto – 20kg",
    price: 20000,
    points: "1.000",
    image: "/img/11.png",
    brand: "Advance",
    weight: "20 KG",
    description: "Lorem ipsum dolor sit amet..."
  },
  {
    id: "advance-perro-15kg",
    title: "Alimento Advance Perro Adulto – 15kg",
    price: 16500,
    points: "800",
    image: "/img/11.png",
    brand: "Advance",
    weight: "15 KG",
    description: "Descripción corta..."
  },
];


export const products: Product[] = Array.from({ length: 12 }, (_, i) => {
  const base = baseProducts[i % baseProducts.length];
  return {
    ...base,
    id: `${base.id}-demo-${i + 1}`,                 // id único
    title: `${base.title} · Var ${i + 1}`,          
    price: base.price + (i % 3) * 500,              
  };
});