"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PagoPendingPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
			<div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
				<Clock size={60} className="mx-auto text-yellow-500 mb-4" />

				<h1 className="text-2xl font-bold text-[#0B1D4C] mb-2">
					Pago pendiente
				</h1>

				<p className="text-gray-600 mb-6">
					Tu pago está siendo procesado. Te notificaremos cuando se
					confirme.
				</p>

				<Link href="/">
					<Button className="bg-[#0B1D4C] hover:bg-[#152c69] text-white w-full">
						Volver al inicio
					</Button>
				</Link>
			</div>
		</div>
	);
}
