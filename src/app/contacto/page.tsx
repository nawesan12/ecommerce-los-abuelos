import HeroContacto from "@/src/components/contacto/heroContacto";
import MapSection from "@/src/components/contacto/map";
import ContactSection from "@/src/components/contacto/msg";
import React from "react";

export default function Page() {
	return (
		<>
			<HeroContacto />
			<ContactSection />
			<MapSection />
		</>
	);
}
