"use client";

interface UserTabsProps {
	selected: string;
	onChange: (value: string) => void;
}

export default function UserTabs({ selected, onChange }: UserTabsProps) {
	return (
		<div className="border-b mb-8 flex gap-10 text-lg font-semibold">
			<button
				className={
					selected === "orders" ? "text-[#0B1D4C]" : "text-gray-500"
				}
				onClick={() => onChange("orders")}>
				Órdenes
			</button>

			<button
				className={
					selected === "pets" ? "text-[#0B1D4C]" : "text-gray-500"
				}
				onClick={() => onChange("pets")}>
				Mascotas
			</button>

			<button
				className={
					selected === "details" ? "text-[#0B1D4C]" : "text-gray-500"
				}
				onClick={() => onChange("details")}>
				Detalles
			</button>
		</div>
	);
}
