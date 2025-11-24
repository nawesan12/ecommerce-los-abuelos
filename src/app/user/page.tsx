"use client";

import { useState } from "react";
import UserTabs from "@/src/components/user/userTabs";
import UserDetails from "@/src/components/user/UserDetails";
import UserOrders from "@/src/components/user/UserOrders";
import UserOrderDetail from "@/src/components/user/UserOrderDetail";
import type { Order } from "@/src/components/user/UserOrders";

export default function UserPage() {
	const [tab, setTab] = useState("details");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	return (
		<div className="max-w-6xl mx-auto my-12 px-4">
			<h1 className="text-4xl font-bold mb-8">Mi Cuenta</h1>

			<UserTabs selected={tab} onChange={setTab} />

			{selectedOrder ? (
				<UserOrderDetail
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			) : tab === "details" ? (
				<UserDetails />
			) : (
				<UserOrders onSelectOrder={setSelectedOrder} />
			)}
		</div>
	);
}
