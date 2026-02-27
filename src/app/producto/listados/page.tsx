import ProductsSection from "@/src/components/products/productsSection";
import { DEFAULT_TENANT_SLUG, getProducts } from "@/src/server/catalog";

export const dynamic = "force-dynamic";

export default async function ProductListingsPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;
	const query = q ?? "";
	const products = await getProducts(DEFAULT_TENANT_SLUG);

	return (
		<div className="max-w-[1300px] mx-auto px-6 py-10">
			<header className="mb-8">
				<h1 className="text-3xl font-extrabold text-[#0B1D4C]">
					Buscar productos
				</h1>
				<p className="text-sm text-gray-600 mt-1">
					{query
						? `Mostrando resultados para "${query}"`
						: "Explorá nuestro catálogo completo o usá el buscador para filtrar."}
				</p>
			</header>

			<ProductsSection searchQuery={query} initialProducts={products} />
		</div>
	);
}
