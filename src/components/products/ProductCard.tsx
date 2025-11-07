"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface ProductCardProps {
	title?: string;
	image?: string;
	price?: number;
	href?: string;
	variant?: "default" | "carousel";
}

export default function ProductCard({
	title = "Alimento para perro Pedigree Adulto 21KG",
	image = "/img/11.png",
	price = 12500,
	href = "/producto/1",
	variant = "default",
}: ProductCardProps) {
	return (
		<Link href={href}>
			<div
				className={`bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
					variant === "carousel" ? "w-full" : "w-[170px] sm:w-[190px]"
				}`}>
				{/* Imagen */}
				<div
					className={`w-full ${
						variant === "carousel" ? "h-60 p-6" : "h-44 p-3"
					} bg-gray-100 relative flex items-center justify-center`}>
					<Image
						src={image}
						alt={title}
						fill
						className="object-contain p-6"
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
							{title}
						</h3>

						<span
							className={`${
								variant === "carousel"
									? "text-[16px]"
									: "text-[14px]"
							} text-gray-500`}>
							{formatCurrency(price)}
						</span>
					</div>

					{/* Corazón */}
					<button
						className="text-[#F32947] hover:scale-110 transition"
						onClick={(e) => {
							e.preventDefault();
						}}>
						<Heart size={22} strokeWidth={2} />
					</button>
				</div>
			</div>
		</Link>
	);
}
