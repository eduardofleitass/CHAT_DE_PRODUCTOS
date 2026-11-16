const pad = (value: number) => String(value).padStart(2, '0'); // "9" -> "09"

// hh:mm local, sin Intl (Hermes lo trae a medias)
export const formatTime = (createdAt: number): string => {
  const date = new Date(createdAt); // epoch ms -> Date local

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`; // arma "09:05"
};

// Iniciales del servicio para el monograma cuando la oferta no trae imagen.
export const initials = (name: string): string =>
  name
    .split(' ') // separa por palabras
    .filter(Boolean) // descarta espacios repetidos
    .slice(0, 2) // solo las dos primeras palabras
    .map((word) => word[0]?.toUpperCase() ?? '') // primera letra de cada una
    .join(''); // "Pre venta..." -> "PV"
