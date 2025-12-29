"use client";

import { useState } from "react";
import { useAuth } from "@/src/stores/auth-store";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
	const router = useRouter();
	const login = useAuth((state) => state.login);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleGoogle = () => {
		// Simulación de login con Google (placeholder hasta integrar OAuth real)
		login({
			name: "Usuario Google",
			apellido: "",
			email: "usuario.google@example.com",
			telefono: "",
			dni: "",
			points: 5000,
		});
		router.push("/user");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("Completá todos los campos.");
			return;
		}

		// ⚠️ SIMULACIÓN DE LOGIN (no real)
		// Acá deberías validar contra tu API/Firebase/Supabase
		if (password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		// Simulación: login exitoso
		login({
			name: "Usuario",
			apellido: "",
			email,
			telefono: "",
			dni: "",
			points: 5000,
		});

		router.push("/user");
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
			{/* Izquierda */}
			<div className="bg-[#0B1D4C] text-white flex flex-col justify-center items-center p-10">
				<img src="/img/logo.svg" alt="Logo" className="w70 mb-4" />
			</div>

			{/* Derecha */}
			<div className="flex flex-col justify-center px-10 md:px-24">
				<button
					onClick={() => router.back()}
					className="text-sm mb-6 text-gray-600 hover:text-[#F32947]">
					← Volver
				</button>

				<h2 className="text-3xl font-bold text-[#0B1D4C] mb-2">
					Acceder
				</h2>
				<p className="text-gray-600 mb-6">Ingresá con tu cuenta</p>

				{error && (
					<div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="text-sm font-semibold block">
							Email
						</label>
						<input
							className="w-full border rounded-lg px-4 py-2 mt-1"
							placeholder="abc@gmail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
						/>
					</div>

					<div>
						<label className="text-sm font-semibold block">
							Contraseña
						</label>
						<input
							className="w-full border rounded-lg px-4 py-2 mt-1"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
						/>
					</div>

					<button
						type="submit"
						className="bg-[#0B1D4C] text-white py-3 rounded-lg w-full hover:bg-[#09163A] transition">
						Iniciar sesión →
					</button>
				</form>

				<div className="mt-6">
					<button
						type="button"
						className="w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
						onClick={handleGoogle}>
						<Image
							src="/img/google-logo.png"
							alt="Google"
							width={18}
							height={18}
						/>
						Iniciar con Google
					</button>
				</div>

				<p className="mt-4 text-xs text-gray-500 text-center">
					¿No tenés cuenta?{" "}
					<a
						href="/register"
						className="text-[#F32947] font-semibold hover:underline">
						Crear cuenta
					</a>
				</p>

				<p className="mt-6 text-center text-sm text-gray-600 cursor-pointer hover:text-[#F32947]">
					¿Olvidó su contraseña?
				</p>
			</div>
		</div>
	);
}
