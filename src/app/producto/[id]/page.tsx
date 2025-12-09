import Image from "next/image";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/products";
import ProductView from "./ProductView";

export default async function ProductPage({
	params,
}: {
	params: { id: string };
}) {
	const id = params.id;

	const product = await getProductById(id);

	if (!product) {
		return (
			<div className="max-w-[1300px] mx-auto px-6 py-12 text-center">
				<h1 className="text-2xl font-semibold">
					Producto no encontrado 😕
				</h1>
				<Link href="/" className="text-[#F32947] underline mt-3 block">
					Volver a la tienda
				</Link>
			</div>
		);
	}

	const all = await getProducts();
	const similares = all.filter((p) => p.id !== id).slice(0, 4);

	const weights = ["7,5 KG", "15 KG", "20 KG"];

	return (
		<div className="max-w-[1300px] mx-auto px-6 py-12">
			<ProductView
				product={product}
				similares={similares}
				weights={weights}
			/>
		</div>
	);
}
