"use client";
import Link from "next/link";
import {
	IconSearch,
	IconHeart,
	IconUser,
	IconShoppingCart,
} from "@tabler/icons-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
	const pathname = usePathname();
	const [searchOpen, setSearchOpen] = useState(false);

	const isInicioGroup =
		pathname === "/" ||
		pathname.startsWith("/perro") ||
		pathname.startsWith("/gato") ||
		pathname.startsWith("/tiendaDePuntos");

	const showSubmenu = isInicioGroup && !searchOpen;
	const showSearch =
		searchOpen ||
		pathname.startsWith("/sobreNosotros") ||
		pathname.startsWith("/contacto");

	return (
		<header className="w-full flex justify-center mt-4">
			<div className="bg-[#0B1D4D] w-[1028px] h-[95px] rounded-full px-[36px] py-[10px] flex items-center justify-between gap-6 text-white shadow-lg">
				<div className="flex items-center gap-2">
					<Link href="/">
						<Image
							src="/img/logo.svg"
							alt="Los Abuelos"
							width={170}
							height={170}
							className="object-contain cursor-pointer"
						/>
					</Link>
				</div>

				<nav className="flex-shrink-0">
					<ul className="flex items-center gap-6 text-sm">
						<li className="flex items-center">
							<Link
								href="/"
								onClick={() => setSearchOpen(false)}
								className={`relative text-[20px] font-medium transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
									pathname === "/"
										? "text-[#F32947] after:scale-x-100"
										: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
								}`}>
								Inicio
							</Link>

							{/* Subcategorías visibles sólo cuando Inicio está activo */}
							{showSubmenu && (
								<span className="ml-4 flex items-center gap-4 text-[15px] text-gray-200">
									<Link
										href="/perro"
										className={`relative transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
											pathname.startsWith("/perro")
												? "text-[#F32947] after:scale-x-100"
												: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
										}`}>
										Perro
									</Link>
									<Link
										href="/gato"
										className={`relative transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
											pathname.startsWith("/gato")
												? "text-[#F32947] after:scale-x-100"
												: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
										}`}>
										Gato
									</Link>
									<Link
										href="/tiendaDePuntos"
										className={`relative transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
											pathname.startsWith(
												"/tiendaDePuntos"
											)
												? "text-[#F32947] after:scale-x-100"
												: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
										}`}>
										Tienda de puntos
									</Link>
								</span>
							)}
						</li>

						<li>
							<Link
								href="/sobreNosotros"
								className={`relative text-[20px] font-medium transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
									pathname.startsWith("/sobreNosotros")
										? "text-[#F32947] after:scale-x-100"
										: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
								}`}>
								Sobre Nosotros
							</Link>
						</li>
						<li>
							<Link
								href="/contacto"
								className={`relative text-[20px] font-medium transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
									pathname.startsWith("/contacto")
										? "text-[#F32947] after:scale-x-100"
										: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
								}`}>
								Contacto
							</Link>
						</li>
					</ul>
				</nav>

				{/* Search pill */}
				{showSearch && (
					<div className="hidden md:flex items-center bg-white rounded-full pl-5 pr-2 py-2 w-[330px]">
						<input
							className="flex-1 bg-transparent outline-none text-[#0B1D4D] placeholder:text-gray-400"
							placeholder="Buscar Productos..."
							onFocus={() => setSearchOpen(true)}
						/>
						<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B1D4D] text-white">
							<IconSearch size={18} stroke={2} />
						</span>
					</div>
				)}

				<div className="flex items-center gap-4">
					{isInicioGroup && (
						<IconSearch
							size={30}
							stroke={2}
							onClick={() => setSearchOpen(!searchOpen)}
							className="cursor-pointer hover:text-[#F32947] transition"
						/>
					)}
					<IconHeart
						size={30}
						stroke={2}
						className="cursor-pointer hover:text-[#F32947] transition"
					/>
					<IconUser
						size={30}
						stroke={2}
						className="cursor-pointer hover:text-[#F32947] transition"
					/>

					<div className="relative cursor-pointer">
						<IconShoppingCart
							size={30}
							stroke={2}
							className="hover:text-[#F32947] transition"
						/>
						<span className="absolute -top-2 -right-2 bg-[#F32947] text-white text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full">
							1
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
