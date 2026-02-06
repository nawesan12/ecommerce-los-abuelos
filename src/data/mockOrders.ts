export type OrderStatus = "Entregado" | "Pendiente" | "En camino";

export type OrderItem = {
	img: string;
	name: string;
	cantidad: number;
	precio: number;
};

export type Order = {
	id: string;
	fecha: string;
	estado: OrderStatus;
	total: number;
	items: OrderItem[];
};

export const mockOrders: Order[] = [
	{
		id: "12345",
		fecha: "12/05/2025",
		estado: "Entregado",
		total: 40000,
		items: [
			{
				img: "/img/11.png",
				name: "Alimento Premium Advance Perro Adulto – 20kg",
				cantidad: 1,
				precio: 20000,
			},
			{
				img: "/img/11.png",
				name: "Alimento Premium Advance Perro Adulto – 20kg",
				cantidad: 1,
				precio: 20000,
			},
		],
	},
	{
		id: "98765",
		fecha: "03/03/2025",
		estado: "Entregado",
		total: 20000,
		items: [
			{
				img: "/img/11.png",
				name: "Piedras Para Gato 10kg",
				cantidad: 1,
				precio: 20000,
			},
		],
	},
];
