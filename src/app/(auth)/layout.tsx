import React from "react";
import { Toaster } from "sonner";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen w-full bg-white">
			<Toaster /> 
			{children}
		</div>
	);
}