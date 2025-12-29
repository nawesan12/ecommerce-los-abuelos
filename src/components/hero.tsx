"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 pb-10">
			<div className="max-w-[1300px] mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 relative z-10">
				{/* IZQUIERDA — TEXTO */}
				<motion.div
					initial={{ opacity: 0, x: -40 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}>
					<p className="text-[#F32947] font-semibold text-sm  sm:text-base">
						Pet Shop
					</p>

					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black leading-tight max-w-lg mt-2">
						El aliado de tu mascota
					</h1>

					<p className="text-gray-700 text-base sm:text-lg mt-4 max-w-md">
						Cuidamos a tu mascota como si fuera parte de nuestra
						familia. Productos de confianza para su bienestar, todos
						los días.
					</p>
				</motion.div>

				<div className="relative flex justify-center lg:justify-end">
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: "easeOut" }}
						className="relative z-10">
						<Image
							src="/img/Beagle.png"
							alt="Perro"
							width={280}
							height={280}
							className="w-[250px] sm:w-[300px] md:w-[340px] lg:w-[490px]"
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 1,
							ease: "easeOut",
							delay: 0.2,
						}}
						className="relative z-10 ml-4">
						<Image
							src="/img/Gato.png"
							alt="Gato"
							width={260}
							height={260}
							className="w-[190px] sm:w-[245px] md:w-[275px] lg:w-[320px]"
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
