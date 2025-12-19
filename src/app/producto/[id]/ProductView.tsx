"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCartStore } from "@/src/stores/cart-store";
import { formatCurrency } from "@/lib/currency";
import { Product, ProductVariant } from "@/src/types/product";
import { toast } from "sonner";
import { useAuth } from "@/src/stores/auth-store";

export default function ProductView({
	product,
	similares,
}: {
	product: any;
	similares: any[];
}) {
	const [selectedVariant, setSelectedVariant] = useState(
		product.variants?.[0] ?? null
	);
	const [quantity, setQuantity] = useState(1);

	const { user } = useAuth();

	const incrementar = () => {
		setQuantity((q) => q + 1);
		toast("Cantidad aumentada");
	};

	const disminuir = () => {
		setQuantity((q) => {
			if (q > 1) {
				toast("Cantidad reducida");
				return q - 1;
			}
			return 1;
		});
	};

	const priceToShow = selectedVariant
		? selectedVariant.price
		: product.variants?.[0]?.price ?? 0;

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
				{/* Imagen */}
				<div className="flex justify-center">
					<div className="relative w-[320px] h-[420px]">
						<Image
							src={product.image}
							alt={product.title}
							fill
							className="object-contain"
						/>
					</div>
				</div>

				{/* Info */}
				<div>
					<h1 className="text-[28px] font-bold text-[#0B1D4C] leading-tight">
						{product.title}{" "}
						{selectedVariant && `- ${selectedVariant.weight}`}
					</h1>

					<p className="text-[26px] font-semibold mt-2">
						${priceToShow.toLocaleString("es-AR")}
					</p>

					{/* Variantes (Pesos) */}
					{product.variants && product.variants.length > 0 && (
						<div className="flex gap-3 mt-6">
							{product.variants.map((variant: any) => (
								<button
									key={variant.id}
									onClick={() => setSelectedVariant(variant)}
									className={`px-4 py-2 border rounded-lg text-sm ${
										selectedVariant?.id === variant.id
											? "border-[#F32947] text-[#F32947] font-semibold"
											: "border-gray-400 hover:border-[#F32947] hover:text-[#F32947]"
									}`}>
									{variant.weight}
								</button>
							))}
						</div>
					)}

					{/* Cantidad */}
					<div className="flex items-center gap-4 mt-8">
						<div className="flex items-center border rounded-full px-3 select-none">
							<button
								onClick={disminuir}
								className="px-3 py-1 text-lg">
								-
							</button>
							<p className="px-2">{quantity}</p>
							<button
								onClick={incrementar}
								className="px-3 py-1 text-lg">
								+
							</button>
						</div>

						<button
							className="bg-[#F32947] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d91d3a] transition"
							onClick={() => {
								if (!selectedVariant) {
									toast.error("Seleccioná una variante");
									return;
								}

								useCartStore.getState().addItem(
									{
										id: selectedVariant.id,
										title: `${product.title} - ${selectedVariant.weight}`,
										price: selectedVariant.price,
										image: product.image,
										variantWeight: selectedVariant.weight,
										productId: product.id,
									},
									quantity
								);

								toast.success(
									"Producto agregado al carrito 🛒"
								);
							}}>
							Agregar al carrito
						</button>

						<Heart
							size={26}
							className="cursor-pointer text-[#F32947] hover:scale-110 transition"
						/>
					</div>
				</div>
			</div>

			{/* Descripción */}
			<div className="mt-14">
				<h2 className="text-xl font-semibold text-[#F32947]">
					Descripción
				</h2>
				<p className="mt-3 text-gray-700 leading-relaxed max-w-[800px]">
					{product.description ??
						"Descripción no disponible temporalmente."}
				</p>
			</div>

			{/* Similares */}
			<div className="mt-16">
				<h2 className="text-xl font-semibold mb-6">
					Productos Similares
				</h2>

				<Carousel
					opts={{ loop: true }}
					className="relative w-full"
					plugins={[
						Autoplay({
							delay: 2500,
							stopOnMouseEnter: true,
						}),
					]}>
					<CarouselContent className="gap-6">
						{similares.map((p) => {
							const minVariantPrice = Math.min(
								...p.variants.map(
									(v: { price: number }) => v.price
								)
							);

							return (
								<CarouselItem
									key={p.id}
									className="basis-3/4 sm:basis-1/2 lg:basis-1/3">
									<Link
										href={`/producto/${p.id}`}
										className="border rounded-xl p-4 hover:shadow-md transition bg-white cursor-pointer block">
										<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
											<div className="relative w-[140px] h-[120px]">
												<Image
													src={p.image}
													alt={p.title}
													fill
													className="object-contain"
												/>
											</div>
										</div>

										<p className="font-medium text-sm mt-3">
											{p.title}
										</p>

										<p className="text-xs text-gray-600">
											{p.variants && p.variants.length > 0
												? formatCurrency(
														Math.min(
															...p.variants.map(
																(v: any) =>
																	v.price
															)
														)
												  )
												: "Sin precio"}
										</p>

										<Heart
											size={18}
											className="text-[#F32947] mt-1"
										/>
									</Link>
								</CarouselItem>
							);
						})}
					</CarouselContent>

					<CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
					<CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
				</Carousel>
			</div>
		</>
	);
}
