import HomePageClient from "@/src/app/HomePageClient";
import { DEFAULT_TENANT_SLUG, getProducts } from "@/src/server/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const products = await getProducts(DEFAULT_TENANT_SLUG);

	return <HomePageClient initialProducts={products} />;
}
