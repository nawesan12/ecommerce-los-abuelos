"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/src/types/product";

interface ProductCardProps {
	product: Product;
	variant?: "default" | "carousel";
}

export default function ProductCard({
	product,
	variant = "default",
}: ProductCardProps) {
	if (!product) return null; // ← evita crashes

	const hasVariants =
		Array.isArray(product.variants) && product.variants.length > 0;

	const minPrice = hasVariants
		? Math.min(...product.variants.map((v) => v.price))
		: 0;

	return (
		<Link href={`/producto/${product.id}`}>
			<div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer w-full">
				{/* Imagen */}
				<div
					className={`w-full ${
						variant === "carousel" ? "h-60 p-6" : "h-44 p-3"
					} bg-gray-100 relative flex items-center justify-center`}>
					<Image
						src={product.image}
						alt={product.title}
						fill
						className="object-contain p-3"
					/>
				</div>

				{/* Info */}
				<div className="flex items-center justify-between px-5 py-4">
					<div>
						<h3
							className={`${
								variant === "carousel"
									? "text-[18px]"
									: "text-[15px]"
							} font-semibold text-black`}>
							{product.title}
						</h3>

						<span
							className={`${
								variant === "carousel"
									? "text-[16px]"
									: "text-[14px]"
							} text-gray-500`}>
							{formatCurrency(minPrice)}
						</span>
					</div>

					<Heart
						size={22}
						strokeWidth={2}
						className="text-[#F32947] hover:scale-110 transition"
						onClick={(e) => e.preventDefault()}
					/>
				</div>
			</div>
		</Link>
	);
}
