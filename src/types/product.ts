export interface ProductVariant {
    id: string;
    weight: string;
    price: number;
}

export interface Product {
    id: string;
    title: string;
    image: string;
    brand: string;
    description: string;
    tags: string[];
    category?: string | null;
    variants: ProductVariant[];
}