"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection() {
	return (
		<section className="bg-white w-full">
			<div className="max-w-[1300px] mx-auto px-6 py-16 lg:flex lg:items-start lg:gap-16">
				{/* --- IZQUIERDA: Info de contacto --- */}
				<div className="lg:w-1/2">
					<h1 className="text-3xl font-extrabold text-[#0B1D4C] capitalize">
						Contactanos <br /> para más información
					</h1>

					<div className="mt-8 space-y-6 text-gray-700">
						<p className="flex items-center gap-3">
							<MapPin className="text-[#F32947]" size={24} />
							<span>
								Cecilia Chapman 711 - Buenos Aires, Argentina
							</span>
						</p>

						<p className="flex items-center gap-3">
							<Phone className="text-[#F32947]" size={24} />
							<span>(+54) 257 - 563 - 7401</span>
						</p>

						<p className="flex items-center gap-3">
							<Mail className="text-[#F32947]" size={24} />
							<span>contacto@losabuelos.com</span>
						</p>
					</div>

					{/* Redes */}
					<div className="mt-10">
						<h3 className="text-gray-600 font-medium mb-2">
							Seguinos
						</h3>

						<div className="flex gap-4 text-gray-400">
							<a
								className="hover:text-[#F32947] transition"
								href="#">
								🐦
							</a>
							<a
								className="hover:text-[#F32947] transition"
								href="#">
								📸
							</a>
							<a
								className="hover:text-[#F32947] transition"
								href="#">
								📘
							</a>
						</div>
					</div>
				</div>

				{/* --- DERECHA: Formulario --- */}
				<div className="mt-10 lg:mt-0 lg:w-1/2">
					<div className="w-full p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
						<h2 className="text-xl font-semibold text-[#0B1D4C]">
							Envíanos un mensaje
						</h2>

						<form className="mt-6 space-y-6">
							<div>
								<label className="text-sm font-medium text-gray-700">
									Nombre completo
								</label>
								<input
									type="text"
									placeholder="Juan Perez"
									className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#F32947] focus:border-[#F32947] outline-none"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">
									Email
								</label>
								<input
									type="email"
									placeholder="correo@example.com"
									className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#F32947] focus:border-[#F32947] outline-none"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">
									Mensaje
								</label>
								<textarea
									placeholder="Escribe tu mensaje..."
									className="w-full mt-2 h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#F32947] focus:border-[#F32947] outline-none resize-none"
								/>
							</div>

							<button className="w-full py-3 mt-4 text-white font-semibold bg-[#F32947] rounded-xl hover:bg-[#c41d39] transition">
								Enviar mensaje
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
