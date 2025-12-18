"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/src/types/product";
import { useLikedStore } from "@/src/stores/liked-store";
import { useAuth } from "@/src/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
	product: Product;
	variant?: "default" | "carousel";
}

export default function ProductCard({
	product,
	variant = "default",
}: ProductCardProps) {
	if (!product) return null;

	const { user } = useAuth();
	const router = useRouter();
	const { toggleLike, isLiked } = useLikedStore();
	const liked = isLiked(product.id);

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
						className={`transition cursor-pointer ${
							liked
								? "fill-[#F32947] text-[#F32947]"
								: "text-[#F32947]"
						}`}
						onClick={(e) => {
							e.preventDefault();

							if (!user) {
								toast.info(
									"Iniciá sesión para guardar favoritos ❤️"
								);
								router.push("/login");
								return;
							}

							toggleLike(product.id);

							if (!liked) {
								toast.success(
									"Producto agregado a favoritos ❤️"
								);
							} else {
								toast("Producto eliminado de favoritos 💔");
							}
						}}
					/>
				</div>
			</div>
		</Link>
	);
}
