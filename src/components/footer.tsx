import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-[#0B1D4D] border-t-4 border-[#F32947] mt-20 text-white w-full">
			<div className="max-w-[1300px] mx-auto px-6 py-14 flex flex-col items-center text-center gap-10">
				{/* LOGO */}
				<Link href="/" className="flex justify-center">
					<Image
						src="/img/logo.svg"
						alt="Los Abuelos Logo"
						width={260}
						height={160}
						className="object-contain"
					/>
				</Link>

				{/* NAV */}
				<nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-[15px]">
					<Link href="/" className="hover:text-[#F32947] transition">
						Inicio
					</Link>
					<Link
						href="/perro"
						className="hover:text-[#F32947] transition">
						Perro
					</Link>
					<Link
						href="/gato"
						className="hover:text-[#F32947] transition">
						Gato
					</Link>
					<Link
						href="/puntos"
						className="hover:text-[#F32947] transition">
						Tienda de puntos
					</Link>
					<Link
						href="/nosotros"
						className="hover:text-[#F32947] transition">
						Sobre Nosotros
					</Link>
					<Link
						href="/contacto"
						className="hover:text-[#F32947] transition">
						Contacto
					</Link>
				</nav>

				<hr className="w-full border-gray-300/40" />

				{/* COPYRIGHT + REDES */}
				<div className="flex flex-col items-center gap-5 text-sm opacity-90">
					<p>
						© {new Date().getFullYear()} Los Abuelos. Todos los
						derechos reservados.
					</p>

					<div className="flex gap-6">
						<Link
							href="#"
							aria-label="TikTok"
							className="hover:opacity-80 transition">
							<Image
								src="/img/social/tiktok.svg"
								alt="TikTok"
								width={26}
								height={26}
							/>
						</Link>
						<Link
							href="#"
							aria-label="Instagram"
							className="hover:opacity-80 transition">
							<Image
								src="/img/social/instagram.svg"
								alt="Instagram"
								width={26}
								height={26}
							/>
						</Link>
						<Link
							href="#"
							aria-label="Facebook"
							className="hover:opacity-80 transition">
							<Image
								src="/img/social/facebook.svg"
								alt="Facebook"
								width={26}
								height={26}
							/>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
