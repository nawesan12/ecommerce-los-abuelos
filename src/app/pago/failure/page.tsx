"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PagoFailurePage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
			<div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
				<XCircle size={60} className="mx-auto text-red-500 mb-4" />

				<h1 className="text-2xl font-bold text-[#0B1D4C] mb-2">
					Pago rechazado
				</h1>

				<p className="text-gray-600 mb-6">
					Hubo un problema con el pago. Podés intentarlo nuevamente.
				</p>

				<Link href="/carrito">
					<Button className="bg-[#F32947] hover:bg-red-600 text-white w-full">
						Volver al carrito
					</Button>
				</Link>
			</div>
		</div>
	);
}
