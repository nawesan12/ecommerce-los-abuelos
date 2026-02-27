import GatoPageClient from "@/src/app/gato/GatoPageClient";
import { DEFAULT_TENANT_SLUG, getProducts } from "@/src/server/catalog";

export const dynamic = "force-dynamic";

export default async function GatoPage() {
	const products = await getProducts(DEFAULT_TENANT_SLUG, { category: "gato" });

	return <GatoPageClient initialProducts={products} />;
}
