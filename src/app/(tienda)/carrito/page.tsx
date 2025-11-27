"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ChevronLeft, CreditCard, MapPin, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/currency";
import ProductCard from "@/src/components/products/ProductCard";

const mockCart = [
  { id: 1, title: "Alimento Premium Advance Perro Adulto - 20kg", price: 20000, quantity: 1, image: "/img/11.png" },
  { id: 2, title: "Alimento Premium Advance Perro Adulto - 20kg", price: 20000, quantity: 1, image: "/img/11.png" },
];

export default function CarritoPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const titles = {
    1: "Tu Carrito",
    2: "Informacion Personal",
    3: "Envio",
    4: "Pago",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1300px] mx-auto px-6">
        
        <div className="mb-6">
          {step === 1 ? (
            <Link href="/" className="flex items-center text-gray-500 hover:text-[#F32947] transition text-sm font-medium w-fit">
              <ChevronLeft size={18} className="mr-1" />
              Seguir Comprando
            </Link>
          ) : (
            <button 
              onClick={() => setStep((prev) => Math.max(1, prev - 1) as any)}
              className="flex items-center text-gray-500 hover:text-[#F32947] transition text-sm font-medium"
            >
              <ChevronLeft size={18} className="mr-1" />
              Volver
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-[#0B1D4C] capitalize">{titles[step]}</h1>
            
            {step === 1 && <Step1Cart items={mockCart} />}
            {step === 2 && <Step2Info />}
            {step === 3 && <Step3Shipping />}
            {step === 4 && <Step4Payment />}

            {step > 1 && (
               <div className="flex justify-end pt-4">
                 <Button 
                   className="bg-[#0B1D4C] hover:bg-[#152c69] text-white h-12 px-8 rounded-lg w-full sm:w-auto"
                   onClick={() => step < 4 ? setStep((prev) => (prev + 1) as any) : alert("prueba")}
                 >
                   {step === 4 ? "Finalizar Compra" : step === 3 ? "Pagar" : "Ir al Envio"}
                 </Button>
               </div>
            )}
          </div>

          <div className="h-fit">
             <OrderSummary step={step} onNext={() => setStep((prev) => Math.min(4, prev + 1) as any)} />
          </div>

        </div>

        {step === 1 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-[#0B1D4C] mb-6">PRODUCTOS RECOMENDADOS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <ProductCard title="Piedras Para Gato" price={5000} />
               <ProductCard title="Alimento 20kg" price={20000} />
               <ProductCard title="Juguete Hueso" price={3500} />
               <ProductCard title="Collar Antipulgas" price={8200} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Step1Cart({ items }: { items: typeof mockCart }) {
  return (
    <div className="space-y-4">
      <div className="hidden sm:grid grid-cols-[1fr_120px_100px_40px] gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
        <span>Producto</span>
        <span className="text-center">Cantidad</span>
        <span className="text-right">Precio</span>
        <span></span>
      </div>

      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:grid sm:grid-cols-[1fr_120px_100px_40px] gap-4 items-center">
          
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-16 h-16 bg-gray-50 rounded-md flex-shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0B1D4C] text-sm leading-tight">{item.title}</h3>
            </div>
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg h-8 w-fit sm:mx-auto">
            <button className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"><Minus size={14} /></button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"><Plus size={14} /></button>
          </div>

          <div className="text-right font-bold text-[#0B1D4C] w-full sm:w-auto">
            {formatCurrency(item.price)}
          </div>

          <button className="text-gray-400 hover:text-red-500 transition">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

function Step2Info() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2 mb-4 text-[#F32947] font-semibold border-b pb-2">
        <User size={20} /> <span>Datos de Contacto</span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Correo Electronico</label>
          <Input placeholder="tuemail@ejemplo.com" className="bg-gray-50 border-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Nombre</label>
            <Input placeholder="Juan" className="bg-gray-50 border-gray-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Apellido</label>
            <Input placeholder="Perez" className="bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">DNI</label>
            <Input placeholder="12345678" type="number" className="bg-gray-50 border-gray-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Telefono</label>
            <Input placeholder="11 1234 5678" type="tel" className="bg-gray-50 border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3Shipping() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2 mb-4 text-[#F32947] font-semibold border-b pb-2">
        <MapPin size={20} /> <span>Direccion de Entrega</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Codigo Postal</label>
          <Input placeholder="7600" className="bg-gray-50 border-gray-200 w-32" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Direccion (Calle y Altura)</label>
          <Input placeholder="Av. Independencia 1234" className="bg-gray-50 border-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Piso / Depto (Opcional)</label>
            <Input placeholder="2B" className="bg-gray-50 border-gray-200" />
          </div>
           <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Localidad</label>
            <Input placeholder="Mar del Plata" className="bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Notas Adicionales</label>
          <Input placeholder="El timbre no funciona, llamar al celular..." className="bg-gray-50 border-gray-200" />
        </div>
      </div>
    </div>
  );
}

function Step4Payment() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2 mb-4 text-[#F32947] font-semibold border-b pb-2">
        <CreditCard size={20} /> <span>Datos de Pago</span>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-xl bg-blue-50 border-blue-200 flex gap-3">
            <div className="mt-1"><Check className="text-blue-600 w-4 h-4" /></div>
            <div>
                <p className="text-sm font-semibold text-blue-800">Tarjeta de Credito / Debito</p>
                <p className="text-xs text-blue-600">Transacciones seguras y encriptadas.</p>
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Numero de Tarjeta</label>
          <Input placeholder="0000 0000 0000 0000" className="bg-gray-50 border-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Vencimiento</label>
            <Input placeholder="MM/AA" className="bg-gray-50 border-gray-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">CVC</label>
            <Input placeholder="123" type="password" className="bg-gray-50 border-gray-200" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Nombre del Titular</label>
          <Input placeholder="Como figura en la tarjeta" className="bg-gray-50 border-gray-200" />
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ step, onNext }: { step: number, onNext: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <h2 className="font-bold text-lg text-[#0B1D4C] mb-4">Resumen</h2>
      
      {step > 1 && (
        <div className="mb-6 space-y-3 border-b pb-4">
           {mockCart.map(item => (
             <div key={item.id} className="flex gap-3">
               <div className="relative w-10 h-10 bg-gray-50 rounded border overflow-hidden flex-shrink-0">
                 <Image src={item.image} alt="prod" fill className="object-contain" />
               </div>
               <div className="flex-1">
                 <p className="text-xs font-medium line-clamp-2 text-gray-700">{item.title}</p>
                 <p className="text-xs text-gray-500">x{item.quantity}</p>
               </div>
               <div className="text-xs font-bold text-[#0B1D4C]">{formatCurrency(item.price)}</div>
             </div>
           ))}
        </div>
      )}

      <div className="space-y-3 text-sm mb-6">
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Codigo de descuento</label>
            <div className="flex gap-2">
                <Input placeholder="Codigo" className="h-9 bg-gray-50 text-xs" />
                <Button variant="outline" className="h-9 text-xs border-[#0B1D4C] text-[#0B1D4C] hover:bg-[#0B1D4C] hover:text-white">APLICAR</Button>
            </div>
        </div>

        <hr className="border-dashed my-4" />

        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(40000)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Envio</span>
          <span className="text-green-600 font-medium">Gratis</span>
        </div>
        
        <div className="flex justify-between text-lg font-extrabold text-[#0B1D4C] pt-2 border-t mt-2">
          <span>Total</span>
          <span>{formatCurrency(40000)}</span>
        </div>
      </div>

      {step === 1 && (
        <Button 
          onClick={onNext}
          className="w-full bg-[#0B1D4C] hover:bg-[#152c69] text-white font-bold h-12 rounded-lg shadow-lg shadow-blue-900/20"
        >
          FINALIZAR COMPRA
        </Button>
      )}
      
      {step === 1 && (
        <div className="mt-4 text-center">
            <Link href="#" className="text-xs font-semibold text-[#0B1D4C] border-b border-[#0B1D4C]">ELEGIR MAS PRODUCTOS</Link>
        </div>
      )}
    </div>
  );
}