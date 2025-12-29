"use client";

import CategoryPoints from "./category-points";
import PointsProgress from "./PointsProgress";
import { pointsProducts, CATEGORY_LIMITS } from "./points-data";
import { useAuth } from "@/src/stores/auth-store";

export default function ProductsPoints() {
	const { user } = useAuth();
	const userPoints = user?.points ?? 0;

	// Filtrar productos por categoría
	const bronzeProducts = pointsProducts.filter(
		(p) => p.category === "bronce"
	);
	const silverProducts = pointsProducts.filter((p) => p.category === "plata");
	const goldProducts = pointsProducts.filter((p) => p.category === "oro");

	return (
		<section className="max-w-[1300px] mx-auto px-6 py-1">
			<h1 className="text-3xl font-extrabold mb-6">
				Productos Canjeables
			</h1>

			{/* Barra de progreso de puntos */}
			<PointsProgress userPoints={userPoints} />

			{/* CATEGORÍA BRONCE */}
			<CategoryPoints
				title={`Categoría Bronce (hasta ${CATEGORY_LIMITS.bronce} pts)`}
				products={bronzeProducts}
				userPoints={userPoints}
			/>

			{/* CATEGORÍA PLATA */}
			<CategoryPoints
				title={`Categoría Plata (hasta ${CATEGORY_LIMITS.plata} pts)`}
				products={silverProducts}
				userPoints={userPoints}
			/>

			{/* CATEGORÍA ORO */}
			<CategoryPoints
				title={`Categoría Oro (hasta ${CATEGORY_LIMITS.oro} pts)`}
				products={goldProducts}
				userPoints={userPoints}
			/>
		</section>
	);
}
