import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
	title: string;
	image: string;
	count: number;
	onClick?: () => void; // 👈 NUEVO
}

export default function CategoryCard({
	title,
	image,
	count,
	onClick,
}: CategoryCardProps) {
	return (
		<div
			onClick={onClick}
			className="group w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
			{/* Imagen */}
			<div className="w-full h-48 relative overflow-hidden">
				<Image
					src={image}
					alt={title}
					fill
					className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
				/>
			</div>

			{/* Contenido */}
			<div className="bg-[#F5F6F7] px-5 py-4 flex justify-between items-center">
				<div>
					<p className="text-lg font-semibold text-black">{title}</p>
					<p className="text-sm text-gray-600">{count} productos</p>
				</div>

				<div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 group-hover:border-[#F32947] transition-colors">
					<span className="text-[#F32947] text-lg">→</span>
				</div>
			</div>
		</div>
	);
}
