"use client";

import { useAuth } from "@/src/stores/auth-store";
import { useState } from "react";

export default function UserDetails() {
	const { user } = useAuth();
	const [form, setForm] = useState({
		name: user?.name || "",
		apellido: user?.apellido || "",
		email: user?.email || "",
		telefono: user?.telefono || "",
		dni: user?.dni || "",
	});

	const handleChange = (e: any) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<div className="border rounded-xl p-6">
			<h3 className="text-xl font-bold mb-4">Detalles</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<input
					name="email"
					value={form.email}
					onChange={handleChange}
					placeholder="Email"
					className="border rounded-lg p-3"
				/>
				<input
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="Nombre"
					className="border rounded-lg p-3"
				/>
				<input
					name="apellido"
					value={form.apellido}
					onChange={handleChange}
					placeholder="Apellido"
					className="border rounded-lg p-3"
				/>
				<input
					name="dni"
					value={form.dni}
					onChange={handleChange}
					placeholder="DNI"
					className="border rounded-lg p-3"
				/>
				<input
					name="telefono"
					value={form.telefono}
					onChange={handleChange}
					placeholder="Teléfono"
					className="border rounded-lg p-3"
				/>
			</div>

			<button className="mt-6 px-6 py-2 bg-[#0B1D4C] text-white rounded-lg">
				Guardar
			</button>
		</div>
	);
}
