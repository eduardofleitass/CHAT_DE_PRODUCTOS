const pad = (value: number) => String(value).padStart(2, '0');

// hh:mm local sin Intl: Hermes lo trae a medias en Android.
export const formatTime = (createdAt: number): string => {
  const date = new Date(createdAt);

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Iniciales para el monograma de los servicios, que no tienen foto.
export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
