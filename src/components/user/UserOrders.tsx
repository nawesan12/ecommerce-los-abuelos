"use client";

import { mockOrders, type Order } from "@/src/data/mockOrders";
import { Package, ChevronRight } from "lucide-react";

export type { Order };

interface UserOrdersProps {
	onSelectOrder: (order: Order) => void;
}

export default function UserOrders({ onSelectOrder }: UserOrdersProps) {
	return (
		<div className="p-6 border rounded-xl bg-white shadow-sm">
			<h3 className="text-2xl font-bold mb-6 text-[#0B1D4C]">
				Tus Órdenes
			</h3>

			{mockOrders.length === 0 ? (
				<div className="py-10 text-center text-gray-500">
					<Package size={48} className="mx-auto mb-3 text-gray-400" />
					No tenés órdenes todavía.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5">
					{mockOrders.map((order) => (
						<div
							key={order.id}
							className="border rounded-xl p-5 shadow-sm bg-gray-50 hover:shadow-md transition cursor-pointer"
							onClick={() => onSelectOrder(order)}>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-semibold text-[#0B1D4C] text-lg">
										Orden #{order.id}
									</p>
									<p className="text-sm text-gray-500">
										{order.fecha}
									</p>
								</div>

								<span
									className={`text-sm font-semibold px-3 py-1 rounded-full ${
										order.estado === "Entregado"
											? "bg-green-100 text-green-700"
											: "bg-yellow-100 text-yellow-700"
									}`}>
									{order.estado}
								</span>
							</div>

							<div className="mt-4 text-sm text-gray-700 flex items-center justify-between">
								<p>{order.items.length} artículos</p>
								<p className="font-semibold text-[#0B1D4C]">
									Total: $
									{order.total.toLocaleString("es-AR")}
								</p>
							</div>

							<div className="mt-4 flex justify-end">
								<button className="flex items-center gap-2 text-[#F32947] font-semibold hover:underline">
									Ver detalles
									<ChevronRight size={18} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
