"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../stores/auth-store";

export default function Points() {
	const pathname = usePathname();
	const { user } = useAuth();

	// Por ahora fallback fijo de 5000 si no hay usuario cargado
	const puntos = user?.points ?? 5000;

	const isActive = pathname.startsWith("/puntos");

	return (
		<Link href="/puntos">
			<div
				className={`flex items-center justify-center rounded-full px-4 h-12 md:h-[95px] md:px-8 shadow-md cursor-pointer select-none transition-all
					${isActive ? "bg-[#F32947]" : "bg-[#0B1D4C] hover:brightness-110"}
				`}>
				<Image
					src="/img/Huella.png"
					alt="Puntos"
					width={40}
					height={32}
					className="object-contain md:w-[75px] md:h-[60px]"
				/>
				<span className="text-white text-[16px] md:text-[22px] font-semibold tracking-wide leading-none">
					{puntos.toLocaleString("es-AR")}
				</span>
			</div>
		</Link>
	);
}
