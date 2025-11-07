import Image from "next/image";
import Link from "next/link";

function Card({
	href,
	imgSrc,
	title,
	accent,
}: {
	href: string;
	imgSrc: string;
	title: string;
	accent: "red" | "blue";
}) {
	const accentColor = accent === "red" ? "#F32947" : "#0B1D4C";

	return (
		<Link
			href={href}
			className="flex flex-col items-center group transition cursor-pointer select-none">
			{/* Imagen */}
			<div className="relative w-[clamp(140px,45vw,280px)] h-[clamp(140px,45vw,280px)] rounded-3xl shadow-sm group-hover:shadow-lg transition-shadow duration-300">
				<Image
					src={imgSrc}
					alt={title}
					fill
					priority
					className="object-contain group-hover:scale-105 transition-transform duration-300"
				/>
			</div>

			{/* Título + subrayado */}
			<div className="mt-4 text-center">
				<h3 className="font-semibold text-[clamp(16px,4vw,26px)]">
					Catálogo para tu{" "}
					<span style={{ color: accentColor }}>{title}</span>
				</h3>
				{/* subrayado como bloque separado: más confiable que absolute */}
				<span
					className="block mx-auto mt-1 h-[2px] w-0 transition-all duration-300 group-hover:w-3/4"
					style={{ backgroundColor: accentColor }}
				/>
			</div>
		</Link>
	);
}

export default function CategorySelector() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-20">
			{/* Siempre dos columnas, se ajusta el tamaño con clamp */}
			<div className="grid grid-cols-2 place-items-center gap-6 sm:gap-10">
				<Card
					href="/gato"
					imgSrc="/img/GatoB.png"
					title="Gato"
					accent="red"
				/>
				<Card
					href="/perro"
					imgSrc="/img/Dalmata.png"
					title="Perro"
					accent="blue"
				/>
			</div>
		</section>
	);
}
