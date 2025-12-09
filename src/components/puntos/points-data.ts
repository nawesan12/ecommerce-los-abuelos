// CATEGORÍAS Y LÍMITES
export const CATEGORY_LIMITS = {
  bronce: 1500,
  plata: 3000,
  oro: 5000,
};

// FUNCIÓN PARA SABER LA CATEGORÍA DEL USUARIO
export function getUserCategory(userPoints: number) {
  if (userPoints >= CATEGORY_LIMITS.oro) return "oro";
  if (userPoints >= CATEGORY_LIMITS.plata) return "plata";
  if (userPoints >= CATEGORY_LIMITS.bronce) return "bronce";
  return "sin-categoria";
}

// PRODUCTOS POR PUNTOS
export const pointsProducts = [

  {
    id: "bron1",
    title: "Juguete Para Perro",
    image: "/img/11.png",
    points: 1500,
    category: "bronce",
  },
  {
    id: "bron2",
    title: "Pelota Reforzada",
    image: "/img/11.png",
    points: 1500,
    category: "bronce",
  },
  {
    id: "bron3",
    title: "Snack Dental x3",
    image: "/img/11.png",
    points: 1500,
    category: "bronce",
  },
  {
    id: "bron4",
    title: "Comedero Antivuelco",
    image: "/img/11.png",
    points: 1500,
    category: "bronce",
  },
 

  
  {
    id: "plat1",
    title: "Cucha Premium",
    image: "/img/11.png",
    points: 3000,
    category: "plata",
  },
  {
    id: "plat2",
    title: "Arenero para Gato",
    image: "/img/11.png",
    points: 3000,
    category: "plata",
  },
  {
    id: "plat3",
    title: "Mochila Transportadora",
    image: "/img/11.png",
    points: 3000,
    category: "plata",
  },
  {
    id: "plat4",
    title: "Rascador para Gato",
    image: "/img/11.png",
    points: 3000,
    category: "plata",
  },
  

 
  {
    id: "oro1",
    title: "Bolso Transportador",
    image: "/img/11.png",
    points: 5000,
    category: "oro",
  },
  {
    id: "oro2",
    title: "Fuente de Agua Automática",
    image: "/img/11.png",
    points: 5000,
    category: "oro",
  },
  {
    id: "oro3",
    title: "Cama Ortopédica",
    image: "/img/11.png",
    points: 5000,
    category: "oro",
  },
  {
    id: "oro4",
    title: "Kit Premium de Juguetes",
    image: "/img/11.png",
    points: 5000,
    category: "oro",
  },
 
];