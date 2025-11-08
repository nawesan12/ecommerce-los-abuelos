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
import { useState, useEffect } from "react";
import Points from "./points";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
	const pathname = usePathname();
	const [searchOpen, setSearchOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [touchStartX, setTouchStartX] = useState<number | null>(null);

	useEffect(() => {
		if (
			pathname.startsWith("/nosotros") ||
			pathname.startsWith("/contacto")
		) {
			setSearchOpen(true);
		} else if (
			pathname === "/" ||
			pathname.startsWith("/perro") ||
			pathname.startsWith("/gato") ||
			pathname.startsWith("/puntos")
		) {
			setSearchOpen(false);
		}
	}, [pathname]);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.touches[0].clientX);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX === null) return;

		const touchEndX = e.changedTouches[0].clientX;
		const swipeDistance = touchEndX - touchStartX;

		if (swipeDistance > 60) {
			setMobileMenuOpen(false);
		}

		setTouchStartX(null);
	};

	const isInicioGroup =
		pathname === "/" ||
		pathname.startsWith("/perro") ||
		pathname.startsWith("/gato") ||
		pathname.startsWith("/puntos");

	const showSubmenu = isInicioGroup && !searchOpen;
	const showSearch =
		searchOpen ||
		pathname.startsWith("/nosotros") ||
		pathname.startsWith("/contacto");

	return (
		<header className="w-full flex justify-center mt-4 relative z-[50]">
			<div className="flex w-full max-w-[1200px] gap-4 items-center">
				<div className="bg-[#0B1D4D] w-full h-[95px] rounded-full px-6 md:px-[42px] py-[10px] flex items-center justify-between gap-6 text-white shadow-lg">
					<div className="flex items-center gap-10">
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

					<nav className="flex-shrink-0 hidden md:block">
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

								<AnimatePresence>
									{showSubmenu && (
										<motion.span
											initial={{ opacity: 0, y: -6 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -6 }}
											transition={{
												duration: 0.25,
												ease: "easeOut",
											}}
											className="ml-4 hidden md:inline-flex items-center gap-4 text-[15px] text-gray-200">
											<Link
												href="/perro"
												className={`relative transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
													pathname.startsWith(
														"/perro"
													)
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
												href="/puntos"
												className={`relative transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
													pathname.startsWith(
														"/puntos"
													)
														? "text-[#F32947] after:scale-x-100"
														: "hover:text-[#F32947] after:scale-x-0 hover:after:scale-x-100"
												}`}>
												Tienda de puntos
											</Link>
										</motion.span>
									)}
								</AnimatePresence>
							</li>

							<li>
								<Link
									href="/nosotros"
									className={`relative text-[20px] font-medium transition after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#F32947] after:left-0 after:-bottom-1 after:origin-left after:transition-transform ${
										pathname.startsWith("/nosotros")
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
					<AnimatePresence>
						{showSearch && (
							<motion.div
								key="searchbar"
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="hidden md:flex items-center bg-white rounded-full pl-5 pr-2 py-2 w-[330px]">
								<input
									className="flex-1 bg-transparent outline-none text-[#0B1D4D] placeholder:text-gray-400"
									placeholder="Buscar Productos..."
									onFocus={() => setSearchOpen(true)}
								/>
								<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B1D4D] text-white">
									<IconSearch size={18} stroke={2} />
								</span>
							</motion.div>
						)}
					</AnimatePresence>

					<button
						className="md:hidden text-white"
						onClick={() => setMobileMenuOpen(true)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 8h16M4 16h16"
							/>
						</svg>
					</button>

					<div className="hidden md:flex items-center gap-4">
						{isInicioGroup && !searchOpen && (
							<IconSearch
								size={30}
								stroke={2}
								onClick={() => setSearchOpen(true)}
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
				<div className="hidden md:block">
					<Points />
				</div>
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
							onClick={() => setMobileMenuOpen(false)}
							onTouchStart={handleTouchStart}
							onTouchEnd={handleTouchEnd}>
							<motion.div
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								transition={{ duration: 0.3, ease: "easeOut" }}
								className="absolute top-0 left-0 h-full w-[260px] bg-[#0B1D4C] text-white flex flex-col gap-6 p-6 shadow-xl"
								onClick={(e) => e.stopPropagation()}>
								<Link
									href="/"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center mb-4">
									<Image
										src="/img/logo.svg"
										alt="Los Abuelos"
										width={120}
										height={120}
										className="object-contain"
									/>
								</Link>
								<button
									className="self-end"
									onClick={() => setMobileMenuOpen(false)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-7 w-7"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>

								<Link
									href="/"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[20px] font-medium">
									Inicio
								</Link>
								<Link
									href="/perro"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[18px]">
									Perro
								</Link>
								<Link
									href="/gato"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[18px]">
									Gato
								</Link>
								<Link
									href="/puntos"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[18px]">
									Tienda de puntos
								</Link>
								<Link
									href="/nosotros"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[20px] font-medium">
									Sobre Nosotros
								</Link>
								<Link
									href="/contacto"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[20px] font-medium">
									Contacto
								</Link>

								<div className="mt-2">
									<Points />
								</div>

								<div className="flex gap-4 mt-4">
									<IconHeart
										size={28}
										stroke={2}
										className="hover:text-[#F32947] transition"
									/>
									<IconUser
										size={28}
										stroke={2}
										className="hover:text-[#F32947] transition"
									/>
									<IconShoppingCart
										size={28}
										stroke={1}
										className="hover:text-[#F32947] transition"
									/>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}
