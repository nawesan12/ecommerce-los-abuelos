import { mockOrders } from "@/src/data/mockOrders";

export interface Order {
	id: string;
	fecha: string;
	estado: string;
	total: number;
	items: {
		img: string;
		name: string;
		cantidad: number;
		precio: number;
	}[];
}

interface UserOrdersProps {
	onSelectOrder: (order: Order) => void;
}

export default function UserOrders({ onSelectOrder }: UserOrdersProps) {
	return (
		<div className="border rounded-xl p-6">
			<h3 className="text-xl font-bold mb-4">Tus Órdenes</h3>

			<table className="w-full text-left">
				<thead>
					<tr className="border-b">
						<th>Orden ID</th>
						<th>Fecha</th>
						<th>Estado</th>
						<th>Total</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{mockOrders.map((order) => (
						<tr key={order.id} className="border-b">
							<td>#{order.id}</td>
							<td>{order.fecha}</td>
							<td>{order.estado}</td>
							<td>${order.total}</td>

							<td
								className="text-[#F32947] cursor-pointer hover:underline"
								onClick={() => onSelectOrder(order)}>
								Detalles
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
