import Image from "next/image";
import Header from "@/src/components/header";
import Footer from "@/src/components/footer";
import React from "react";

const HeroSection = () => (
    <section className="bg-white py-12 md:py-24 max-w-[1300px] mx-auto px-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between relative">
            <div className="lg:w-1/2 p-4 text-left relative z-10">
                <h1 className="text-sm font-bold text-red-700 mb-2">
                    Pet Shop
                </h1>
                <p className="text-3xl md:text-5xl font-extrabold text-[#1a1a1a] mb-6">
                    Si los animales hablaran, te contarian sobre los abuelos
                </p>
                <p className="text-gray-600 mb-8 max-w-md">
                    En cada visita vas a encontrar lo mejor para tu mascota. Productos, atencion y el toque de quienes aman a los animales desde siempre.
                </p>
                <button className="bg-black text-white font-semibold py-3 px-8 rounded hover:bg-gray-800 transition duration-300">
                    Ver tienda
                </button>
            </div>

            <div className="lg:w-1/2 p-4 mt-12 lg:mt-0 relative flex justify-center lg:justify-end">
                <div className="absolute w-[200px] h-[200px] top-10 right-308 transform translate-x-1/4 -translate-y-1/4">
                     <Image
                        src="/img/Blob.svg" 
                        alt="Fondo curvo grande"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="absolute w-[200px] h-[200px] -bottom-10 left-0 transform -translate-x-1/2 translate-y-1/2">
                    <Image
                        src="/img/Blob.svg"
                        alt="Fondo curvo pequeño"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="relative z-20 w-full max-w-md h-[450px]">
                    <Image
                        src="/img/Beagle.png"
                        alt="Beagle feliz"
                        layout="fill"
                        objectFit="cover"
                        priority
                        className=""
                    />
                </div>
            </div>
        </div>
    </section>
);

const AbuelosSection = () => (
    <section className="bg-white py-16 px-6">
        <div className="max-w-[1300px] mx-auto text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[#1a1a1a] mb-6">
                        Los Abuelos
                    </h2>
                    <p className="text-gray-600 max-w-lg">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores in, ducimus praesentium sed repellendus blanditiis itaque illum, impedit delectus sunt veniam! Aliquid voluptatem neque omnis hic libero autem, rem dolorem?
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 self-center">
                    <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-3xl font-bold text-[#1a1a1a]">2k+</p>
                        <p className="text-gray-500 text-sm">Clientes contentos</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-3xl font-bold text-[#1a1a1a]">72</p>
                        <p className="text-gray-500 text-sm">Marcas</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-3xl font-bold text-[#1a1a1a]">1.8k+</p>
                        <p className="text-gray-500 text-sm">Productos</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-3xl font-bold text-[#1a1a1a]">28</p>
                        <p className="text-gray-500 text-sm">Años en la industria</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl">
                </div>
                <div>
                    <h3 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                        Jorge Lombardo
                    </h3>
                    <p className="text-red-500 font-semibold mb-4">Fundador</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt commodi quae exercitationem. Placeat praesentium officia tenetur asperiores a obcaecati facilis beatae, nemo commodi quo voluptate numquam quasi. Iusto, commodi mollitia?
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default function AboutUsPage() {
    return (
        <div className="text-center pt-12">
            <main>
                <HeroSection />
                <AbuelosSection />
            </main>
        </div>
    );
}
