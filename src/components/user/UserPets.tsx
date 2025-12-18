"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { mockPets, type Pet } from "@/src/data/mockPets";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function UserPets() {
	const [pets, setPets] = useState<Pet[]>(mockPets);

	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Form nuevo pet
	const [name, setName] = useState("");
	const [food, setFood] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

	const openModal = () => setIsModalOpen(true);

	const closeModal = () => {
		setIsModalOpen(false);
		setName("");
		setFood("");
		setImageFile(null);
		setImagePreview(null);
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageFile(file);
		const url = URL.createObjectURL(file);
		setImagePreview(url);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !food.trim() || !imagePreview) {
			return;
		}

		const newPet: Pet = {
			id:
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: Date.now().toString(),
			name: name.trim(),
			food: food.trim(),
			// guardamos la URL de preview; más adelante esto se cambiará por la URL real del backend
			image: imagePreview,
		};

		setPets((prev) => [...prev, newPet]);
		toast.success("Mascota agregada correctamente 🐾");
		closeModal();
	};

	return (
		<div className="p-6 border rounded-xl">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Mis Mascotas</h2>
				<button
					onClick={openModal}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1D4C] text-white text-sm font-semibold hover:bg-[#071436] transition">
					<Plus size={18} />
					Agregar mascota
				</button>
			</div>

			<p className="text-gray-600 mb-4">
				Agregá tus mascotas para recordar qué comida usan y verlas más
				rápido.
			</p>

			{pets.length === 0 ? (
				<div className="mt-6 p-4 border-2 border-dashed rounded-xl text-center text-gray-400">
					No hay mascotas registradas aún.
				</div>
			) : (
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{pets.map((pet) => (
						<div
							key={pet.id}
							className="border rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm relative">
							<button
								onClick={() => setPetToDelete(pet)}
								className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
								type="button">
								<X size={18} />
							</button>
							<div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
								{/* Si es una imagen del proyecto usamos Image, 
                    si es subida por el usuario (blob:) usamos img normal */}
								{pet.image.startsWith("/img/") ? (
									<Image
										src={pet.image}
										alt={pet.name}
										fill
										className="object-cover"
									/>
								) : (
									<img
										src={pet.image}
										alt={pet.name}
										className="w-full h-full object-cover"
									/>
								)}
							</div>

							<div className="flex-1 text-left">
								<p className="font-semibold text-[15px]">
									{pet.name}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Comida habitual:
								</p>
								<p className="text-sm text-[#0B1D4C] font-semibold">
									{pet.food}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			{/* MODAL NUEVA MASCOTA */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
						<button
							onClick={closeModal}
							className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
							type="button">
							<X size={20} />
						</button>

						<h3 className="text-xl font-bold text-[#0B1D4C] mb-4">
							Nueva Mascota
						</h3>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									FOTO
								</label>
								<div className="flex items-center gap-4">
									<label className="cursor-pointer inline-flex items-center px-3 py-2 border rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageChange}
										/>
										Subir imagen
									</label>

									{imagePreview && (
										<div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100">
											<img
												src={imagePreview}
												alt="Preview mascota"
												className="w-full h-full object-cover"
											/>
										</div>
									)}
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									NOMBRE
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F32947]"
									placeholder="Rocky"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									COMIDA QUE USA
								</label>
								<input
									type="text"
									value={food}
									onChange={(e) => setFood(e.target.value)}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F32947]"
									placeholder="Advance Perro Adulto 20kg"
								/>
							</div>

							<button
								type="submit"
								className="mt-2 w-full bg-[#0B1D4C] text-white font-semibold py-2 rounded-lg hover:bg-[#071436] transition disabled:opacity-60"
								disabled={
									!name.trim() ||
									!food.trim() ||
									!imagePreview
								}>
								Guardar mascota
							</button>
						</form>
					</div>
				</div>
			)}

			{petToDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
						<h3 className="text-lg font-bold mb-4 text-[#0B1D4C]">
							¿Eliminar mascota?
						</h3>
						<p className="text-sm text-gray-600 mb-6">
							¿Seguro que querés eliminar a {petToDelete.name}?
							Esta acción no se puede deshacer.
						</p>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setPetToDelete(null)}
								className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50">
								Cancelar
							</button>

							<button
								onClick={() => {
									setPets((prev) =>
										prev.filter(
											(p) => p.id !== petToDelete.id
										)
									);
									toast.success("Mascota eliminada");
									setPetToDelete(null);
								}}
								className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
