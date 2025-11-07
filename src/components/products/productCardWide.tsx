import Image from "next/image";

interface ProductCardWideProps {
	title?: string;
	price?: number;
	image?: string;
}

export default function ProductCardWide({
	title = "Alimento para Perro 20kg",
	price = 15000,
	image = "/img/11.png",
}: ProductCardWideProps) {
	return (
		<div className="border rounded-xl p-4 hover:shadow-lg transition cursor-pointer bg-white">
			<div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
				<Image
					src={image}
					alt={title}
					width={200}
					height={200}
					className="object-contain"
				/>
			</div>

			<div className="mt-4">
				<h3 className="text-sm font-semibold text-gray-800">{title}</h3>
				<p className="text-[#F32947] font-bold mt-1">${price}</p>
			</div>
		</div>
	);
}
