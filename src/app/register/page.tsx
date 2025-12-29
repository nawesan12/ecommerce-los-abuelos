"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/auth-store";

export default function RegisterPage() {
	const router = useRouter();
	const login = useAuth((state) => state.login);

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleGoogle = () => {
		// Simula registro/login con Google
		login({
			name: "Usuario Google",
			apellido: "",
			email: "usuario.google@example.com",
			telefono: phone,
			dni: "",
			points: 5000,
		});
		router.push("/user");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!name || !email || !password || !confirmPassword || !phone) {
			setError("Completá todos los campos.");
			return;
		}

		if (password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden.");
			return;
		}

		// Simulación de creación de cuenta
		login({
			name,
			apellido: "",
			email,
			telefono: phone,
			dni: "",
			points: 5000,
		});

		router.push("/user");
	};

	return (
		<div className="min-h-screen flex bg-white">
			<div className="hidden md:flex w-1/2 bg-[#0B1D4D] text-white flex-col items-center justify-center">
				<div className="bg-[#0B1D4C] text-white flex flex-col justify-center items-center p-10">
					<img src="/img/logo.svg" alt="Logo" className="w70 mb-4" />
				</div>
			</div>

			<div className="flex-1 flex items-center justify-center px-6 md:px-12">
				<div className="w-full max-w-md">
					<button
						onClick={() => router.back()}
						className="text-sm text-gray-500 mb-4 hover:underline">
						&lt; Volver
					</button>

					<h1 className="text-2xl font-bold text-[#0B1D4D] mb-2">
						Crear cuenta
					</h1>

					{error && (
						<div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								NOMBRE COMPLETO
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full border rounded-lg px-3 py-2"
								placeholder="Juan Pérez"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								NÚMERO TELEFÓNICO
							</label>
							<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full border rounded-lg px-3 py-2"
								placeholder="+54 9 11 1234 5678"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								EMAIL
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full border rounded-lg px-3 py-2"
								placeholder="abc@gmail.com"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								CONTRASEÑA
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full border rounded-lg px-3 py-2"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								REPETIR CONTRASEÑA
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								className="w-full border rounded-lg px-3 py-2"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							className="mt-4 w-full bg-[#0B1D4D] text-white font-semibold py-2 rounded-lg hover:bg-[#071436] transition">
							Crear cuenta
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
							Registrarse con Google
						</button>
					</div>

					<p className="mt-4 text-xs text-gray-500 text-center">
						¿Ya tenés cuenta?{" "}
						<a
							href="/login"
							className="text-[#F32947] font-semibold hover:underline">
							Iniciar sesión
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
