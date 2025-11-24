"use client";

import { IconHome, IconSettings } from "@tabler/icons-react";

interface UserTabsProps {
	selected: string;
	onChange: (tab: string) => void;
}

export default function UserTabs({ selected, onChange }: UserTabsProps) {
	return (
		<div className="border rounded-xl p-4 flex items-center justify-between mb-8">
			<button
				onClick={() => onChange("details")}
				className={`flex items-center gap-2 text-lg font-semibold ${
					selected === "details" ? "text-[#0B1D4C]" : "text-gray-500"
				}`}>
				<IconHome size={22} />
				Detalles
			</button>

			<button
				onClick={() => onChange("orders")}
				className={`flex items-center gap-2 text-lg font-semibold ${
					selected === "orders" ? "text-[#0B1D4C]" : "text-gray-500"
				}`}>
				<IconSettings size={24} />
			</button>
		</div>
	);
}
