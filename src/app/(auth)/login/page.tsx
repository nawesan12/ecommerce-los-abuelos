"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  Facebook, 
  Instagram, 
  Twitter 
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      
      <div className="hidden lg:flex w-1/2 bg-[#0B1D4C] flex-col items-center justify-center relative p-12 text-white">
        
        <div className="flex flex-col items-center z-10">

          <div className="relative w-48 h-48 mb-4">

             <Image 
               src="/img/logo.svg"
               alt="Los Abuelos Logo"
               fill
               className="object-contain brightness-0 invert" 
             />
          </div>

          <h1 className="text-5xl font-bold tracking-wide mb-2">Los Abuelos</h1>
          <p className="text-[#F32947] font-bold tracking-widest text-sm">
            EL ALIADO DE TU MASCOTA
          </p>
        </div>

        <div className="absolute bottom-10 flex gap-4">
          <SocialButton icon={<Facebook size={20} />} />
          <SocialButton icon={<Instagram size={20} />} />
          <SocialButton icon={<Twitter size={20} />} />
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 sm:p-16 md:p-24 justify-center relative">
        
        <Link 
          href="/" 
          className="absolute top-8 left-8 sm:left-16 md:left-24 flex items-center text-gray-600 hover:text-[#0B1D4C] transition text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver
        </Link>

        <div className="max-w-md w-full mx-auto mt-10 lg:mt-0">
          <h2 className="text-3xl font-bold text-[#0B1D4C] mb-2">Acceder</h2>
          <p className="text-gray-500 mb-8 text-sm">Accede a tu cuenta</p>

          <form className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">
                Nombre de usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="text" 
                  placeholder="abc" 
                  className="pl-10 h-11 rounded-lg border-gray-200 bg-white focus-visible:ring-[#0B1D4C]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">
                Numero telefonico
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="tel" 
                  placeholder="(91) 8767564357" 
                  className="pl-10 h-11 rounded-lg border-gray-200 bg-white focus-visible:ring-[#0B1D4C]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="email" 
                  placeholder="abc@gmail.com" 
                  className="pl-10 h-11 rounded-lg border-gray-200 bg-white focus-visible:ring-[#0B1D4C]"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-[#0B1D4C] hover:bg-[#152c69] text-white h-12 rounded-lg mt-4 text-base flex justify-between items-center px-6"
            >
              <span></span> 
              <span>Siguiente</span>
              <ChevronRight size={20} />
            </Button>

            <div className="text-center mt-4">
              <Link href="#" className="text-xs font-bold text-black hover:underline">
                Olvido Su Contraseña?
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="bg-white text-[#0B1D4C] p-2 rounded-md hover:scale-110 transition transform">
      {icon}
    </button>
  );
}