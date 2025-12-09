"use client";

import { CATEGORY_LIMITS, getUserCategory } from "./points-data";

type UserCategory = "bronce" | "plata" | "oro" | "sin-categoria";

interface PointsProgressProps {
	userPoints: number;
}

function getNextLimit(category: UserCategory): number {
	switch (category) {
		case "sin-categoria":
			return CATEGORY_LIMITS.bronce;
		case "bronce":
			return CATEGORY_LIMITS.plata;
		case "plata":
			return CATEGORY_LIMITS.oro;
		case "oro":
			return CATEGORY_LIMITS.oro; // ya está al máximo
	}
}

function getCategoryLabel(category: UserCategory): string {
	switch (category) {
		case "bronce":
			return "Bronce";
		case "plata":
			return "Plata";
		case "oro":
			return "Oro";
		default:
			return "Sin categoría";
	}
}

export default function PointsProgress({ userPoints }: PointsProgressProps) {
	const category = getUserCategory(userPoints) as UserCategory;
	const nextLimit = getNextLimit(category);

	const progress =
		category === "oro" ? 1 : Math.min(userPoints / nextLimit, 1);

	const percent = Math.round(progress * 100);
	const pointsToNext =
		category === "oro" ? 0 : Math.max(nextLimit - userPoints, 0);

	return (
		<div className="mb-10 border rounded-2xl p-5 bg-white shadow-sm">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
				<div>
					<p className="text-sm text-gray-600">Tus puntos actuales</p>
					<p className="text-2xl font-extrabold text-[#0B1D4C]">
						{userPoints.toLocaleString("es-AR")} pts
					</p>
				</div>

				<div className="text-right">
					<p className="text-xs text-gray-500">Tu categoría</p>
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0B1D4C] text-white">
						{getCategoryLabel(category)}
					</span>
				</div>
			</div>

			{/* Barra de progreso */}
			<div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden mb-2">
				<div
					className="h-full bg-gradient-to-r from-[#F32947] to-[#FF8A3C] transition-all"
					style={{ width: `${percent}%` }}
				/>
			</div>

			{/* Texto de ayuda */}
			{category === "oro" ? (
				<p className="text-xs text-green-600 font-medium">
					¡Ya sos categoría Oro! Tenés acceso a todos los productos de
					puntos.
				</p>
			) : (
				<p className="text-xs text-gray-600">
					Te faltan{" "}
					<span className="font-semibold">
						{pointsToNext.toLocaleString("es-AR")} pts
					</span>{" "}
					para llegar a{" "}
					<span className="font-semibold">
						{category === "sin-categoria"
							? "Bronce"
							: "la próxima categoría"}
					</span>
					.
				</p>
			)}
		</div>
	);
}
