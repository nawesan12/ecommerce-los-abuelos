"use client";

interface OrderItem {
	img: string;
	name: string;
	cantidad: number;
	precio: number;
}

interface Order {
	id: string;
	fecha: string;
	estado: string;
	total: number;
	items: OrderItem[];
}

export default function UserOrderDetail({
	order,
	onClose,
}: {
	order: Order;
	onClose: () => void;
}) {
	return (
		<div className="border rounded-xl p-6 bg-white shadow-md">
			<h3 className="text-xl font-bold mb-6">Detalles de la Orden</h3>

			{order.items.map((item, idx) => (
				<div
					key={idx}
					className="flex items-center gap-4 border-b pb-4 mb-4">
					<img
						src={item.img}
						className="w-20 h-20 object-cover rounded-lg"
					/>
					<div className="flex-1">
						<p className="font-semibold">{item.name}</p>
						<p className="text-sm text-gray-600">
							Cantidad: {item.cantidad}
						</p>
						<p className="font-bold text-[#0B1D4D]">
							${item.precio}
						</p>
					</div>
				</div>
			))}

			<button
				className="px-6 py-2 bg-[#0B1D4C] text-white rounded-lg hover:bg-[#081332] transition"
				onClick={onClose}>
				Volver
			</button>

			<button
				onClick={() => alert("Función pendiente: mandar al carrito")}
				className="mt-6 w-full bg-[#F32947] text-white py-3 rounded-lg font-semibold hover:bg-[#d91d3a] transition">
				Volver a comprar
			</button>
		</div>
	);
}
