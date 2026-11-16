const pad = (value: number) => String(value).padStart(2, '0');

// hh:mm local, sin Intl (Hermes y algunos navegadores viejos lo traen a medias)
export const formatTime = (createdAt: number): string => {
  const date = new Date(createdAt);

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
