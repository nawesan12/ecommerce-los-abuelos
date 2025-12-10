"use client";

import { useState } from "react";

interface AddPetModalProps {
	onClose: () => void;
	onSave: (pet: { name: string; image: string; food: string }) => void;
}

export default function AddPetModal({ onClose, onSave }: AddPetModalProps) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("");
	const [food, setFood] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSave({ name, image, food });
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
				<h2 className="text-xl font-bold mb-4">Agregar Mascota</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="font-semibold text-sm">Nombre</label>
						<input
							type="text"
							className="w-full border rounded-lg px-3 py-2"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="font-semibold text-sm">
							URL de la Imagen
						</label>
						<input
							type="text"
							className="w-full border rounded-lg px-3 py-2"
							placeholder="/img/perrito.png"
							value={image}
							onChange={(e) => setImage(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="font-semibold text-sm">
							Comida favorita
						</label>
						<input
							type="text"
							className="w-full border rounded-lg px-3 py-2"
							value={food}
							onChange={(e) => setFood(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="mt-2 w-full bg-[#0B1D4C] text-white py-2 rounded-lg font-semibold">
						Guardar Mascota
					</button>
				</form>

				<button
					onClick={onClose}
					className="mt-4 w-full text-center text-sm text-gray-500 hover:underline">
					Cancelar
				</button>
			</div>
		</div>
	);
}
