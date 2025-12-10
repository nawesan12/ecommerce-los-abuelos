"use client";

import { useState } from "react";

import UserDetails from "@/src/components/user/UserDetails";
import UserOrders from "@/src/components/user/UserOrders";
import UserOrderDetail from "@/src/components/user/UserOrderDetail";
import UserPets from "@/src/components/user/UserPets";
import type { Order } from "@/src/components/user/UserOrders";
import UserTabs from "@/src/components/user/userTabs";

export default function UserPage() {
	const [tab, setTab] = useState("details");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	return (
		<div className="max-w-6xl mx-auto my-12 px-4">
			<h1 className="text-4xl font-bold mb-6">Mi Cuenta</h1>

			{/* NUEVO MENÚ */}
			<UserTabs selected={tab} onChange={setTab} />

			{/** si el usuario está viendo una orden */}
			{selectedOrder ? (
				<UserOrderDetail
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			) : tab === "details" ? (
				<UserDetails />
			) : tab === "orders" ? (
				<UserOrders
					onSelectOrder={(order) => setSelectedOrder(order)}
				/>
			) : (
				<UserPets />
			)}
		</div>
	);
}
