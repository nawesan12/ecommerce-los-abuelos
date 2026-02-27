import PerroPageClient from "@/src/app/perro/PerroPageClient";
import { DEFAULT_TENANT_SLUG, getProducts } from "@/src/server/catalog";

export const dynamic = "force-dynamic";

export default async function PerroPage() {
	const products = await getProducts(DEFAULT_TENANT_SLUG, { category: "perro" });

	return <PerroPageClient initialProducts={products} />;
}
