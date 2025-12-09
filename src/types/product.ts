// src/types/product.ts

export interface Product {
    id: string;              
    title: string;           
  image: string;           
  price: number;           
  brand: string;           
  tags: string[];          
  description: string;     


  category?: "perro" | "gato";
}