"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroPoints() {
	return (
		<section className="bg-white w-full pt-16 sm:pt-20 pb-0">
			<div className="max-w-[1300px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
				{/* TEXTO */}
				<motion.div
					initial={{ opacity: 0, x: -40 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className="text-center md:text-left">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[#0B1D4C]">
						Canjea tus{" "}
						<span className="text-[#F32947]">PATITAS!</span>
					</h1>

					<p className="text-gray-600 text-base sm:text-lg mt-4 max-w-md mx-auto md:mx-0">
						Canjea tus patitas por productos exclusivos!
					</p>
				</motion.div>

				{/* IMAGEN */}
				<motion.div
					initial={{ opacity: 0, y: 25 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
					className="flex justify-center md:justify-end">
					<Image
						src="/img/Huella.png"
						alt="Perro feliz"
						width={480}
						height={480}
						className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] object-contain"
						priority
					/>
				</motion.div>
			</div>
		</section>
	);
}
