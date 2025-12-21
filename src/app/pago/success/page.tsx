"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PagoSuccessPage() {
	const params = useSearchParams();

	const paymentId = params.get("payment_id");
	const status = params.get("status");
	const preferenceId = params.get("preference_id");

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
			<div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
				<CheckCircle
					size={60}
					className="mx-auto text-green-500 mb-4"
				/>

				<h1 className="text-2xl font-bold text-[#0B1D4C] mb-2">
					¡Pago recibido!
				</h1>

				<p className="text-gray-600 mb-4">
					Estamos confirmando tu pago con Mercado Pago.
				</p>

				<div className="text-sm text-gray-500 mb-6 space-y-1">
					<p>
						<strong>Estado:</strong> {status}
					</p>
					<p>
						<strong>Pago:</strong> {paymentId}
					</p>
				</div>

				<Link href="/">
					<Button className="bg-[#0B1D4C] hover:bg-[#152c69] text-white w-full">
						Volver a la tienda
					</Button>
				</Link>
			</div>
		</div>
	);
}
