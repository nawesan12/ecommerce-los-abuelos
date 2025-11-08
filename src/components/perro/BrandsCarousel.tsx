"use client";

import Image from "next/image";

const brands = [
	{ name: "Royal Canin", image: "/img/RoyalCanin.png" },
	{ name: "Advance", image: "/img/Advance.png" },
	{ name: "Purina", image: "/img/Purina.png" },
	{ name: "Vitalcan", image: "/img/VitalCan.png" },
	{ name: "VitalPet", image: "/img/VitalPet.png" },
	{ name: "Eukanuba", image: "/img/Eukanuba.png" },
	{ name: "Royal Canin", image: "/img/RoyalCanin.png" },
	{ name: "Advance", image: "/img/Advance.png" },
	{ name: "Purina", image: "/img/Purina.png" },
	{ name: "Vitalcan", image: "/img/VitalCan.png" },
	{ name: "VitalPet", image: "/img/VitalPet.png" },
	{ name: "Eukanuba", image: "/img/Eukanuba.png" },
];

// Duplicado para loop continuo
const loop = [...brands, ...brands];

export default function BrandsCarousel() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-3 py-1 overflow-hidden relative">
			<h2 className="text-[28px] sm:text-[34px] font-extrabold mb-12 text-center">
				MARCAS POPULARES
			</h2>

			{/* FADE LATERAL */}
			<div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-20"></div>
			<div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-20"></div>

			<div className="relative w-full overflow-hidden">
				{/* CINTA 1 */}
				<div className="marquee-track flex items-center gap-14 whitespace-nowrap will-change-transform">
					{loop.map((b, i) => (
						<div
							key={`row1-${i}`}
							className="flex-none shrink-0 w-[200px] h-[90px] sm:w-[240px] sm:h-[110px] md:w-[260px] md:h-[120px] flex items-center justify-center transition-transform hover:scale-[1.08] ">
							<div className="relative w-full h-full">
								<Image
									src={b.image}
									alt={b.name}
									fill
									className="object-contain"
								/>
							</div>
						</div>
					))}
				</div>

				{/* CINTA 2 DESFASADA */}
				<div className="marquee-track2 absolute inset-0 flex items-center gap-14 whitespace-nowrap will-change-transform">
					{loop.map((b, i) => (
						<div
							key={`row2-${i}`}
							className="flex-none shrink-0 w-[200px] h-[90px] sm:w-[240px] sm:h-[110px] md:w-[260px] md:h-[120px] flex items-center justify-center transition-transform hover:scale-[1.08] ">
							<div className="relative w-full h-full">
								<Image
									src={b.image}
									alt={b.name}
									fill
									className="object-contain"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
