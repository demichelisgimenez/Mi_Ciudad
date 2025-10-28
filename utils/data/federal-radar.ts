export type FederalRadarItem = {
  key: string;
  name: string;
  title: string;
  desc?: string;
  image: string;
  homepage?: string;
  streamUrl?: string;
  searchHints?: string[];
};

export const FEDERAL_RADAR: FederalRadarItem[] = [
  {
    key: "integracion-905",
    name: "Radio Integración",
    title: "FM 90.5 Radio Integración",
    desc: "LRM 910. Noticias locales y música.",
    image: "https://elradar.ar/wp-content/uploads/radio-integracion-80x80.png",
    homepage: "https://federalaldia.com.ar/",
    streamUrl: "https://streaming01.shockmedia.com.ar/9992/stream",
    searchHints: ["Integracion Federal", "LRM910", "90.5 Federal"],
  },
  {
    key: "djfederal-921",
    name: "DJ Federal",
    title: "FM 92.1 DJ Federal",
    desc: "Online / hits / mixes.",
    image: "https://elradar.ar/wp-content/uploads/radio-dj-federal-80x80.jpg",
    streamUrl: "https://radios.solumedia.com:6150/stream?icy=http",
    searchHints: ["DJ Federal 92.1"],
  },
  {
    key: "venecia-933",
    name: "Radio Venecia",
    title: "FM 93.3 Radio Venecia",
    desc: "Noticias locales y música variada.",
    image: "https://elradar.ar/wp-content/uploads/radio-venecia-80x80.webp",
    streamUrl: "https://stream.zeno.fm/ase8xrnuruhvv",
    searchHints: ["Venecia 93.3 Federal"],
  },
  {
    key: "centro-945",
    name: "Centro FM",
    title: "FM 94.5 Centro FM",
    image: "https://elradar.ar/wp-content/uploads/Centro-FM-80x80.jpg",
    // El Radar publica esta URL; si no corresponde, dejala y luego la ajustamos:
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/FM999_56AAC.aac",
    searchHints: ["Centro 94.5 Federal"],
  },
  {
    key: "litoral-969",
    name: "La Nueva del Litoral",
    title: "FM 96.9 La Nueva del Litoral",
    image: "https://elradar.ar/wp-content/uploads/la-nueva-del-litoral-1-80x80.jpg",
    // El Radar marca “no disponible”, pero hay una URL publicada:
    streamUrl: "https://proxy01.servidorenlinea.net/streaming1/8152/",
    searchHints: ["La Nueva del Litoral 96.9 Federal"],
  },
  {
    key: "vida-979",
    name: "Radio Vida",
    title: "FM 97.9 Radio Vida",
    desc: "Ponele vida.",
    image: "https://elradar.ar/wp-content/uploads/fm-vida-80x80.jpg",
    streamUrl: "https://streaming01.shockmedia.com.ar:10579/stream?icy=http",
    searchHints: ["Vida 97.9 Federal"],
  },
  {
    key: "mix-985",
    name: "Radio Mix",
    title: "FM 98.5 Radio Mix",
    image: "https://elradar.ar/wp-content/uploads/radio-mix-985-80x80.jpg",
    streamUrl: "https://radios.solumedia.com:10941/stream?icy=http",
    searchHints: ["Mix 98.5 Federal"],
  },
  {
    key: "lacien-999",
    name: "La Cien de Federal",
    title: "FM 99.9 La Cien de Federal",
    image: "https://elradar.ar/wp-content/uploads/la100-1-80x80.jpg",
    homepage: "https://laciendefederal.com.ar/",
    streamUrl: "https://radios.solumedia.com:6548/stream?icy=http",
    searchHints: ["La 100 99.9 Federal"],
  },
  {
    key: "universo-1021",
    name: "Universo Plus",
    title: "FM 102.1 Universo Plus",
    desc: "El Poder de los Clásicos.",
    image: "https://elradar.ar/wp-content/uploads/radio-universo-plus-80x80.jpeg",
    streamUrl: "https://streaming01.shockmedia.com.ar:10264/stream?icy=http",
    searchHints: ["Universo Plus 102.1 Federal"],
  },
  {
    key: "positiva-1025",
    name: "Positiva",
    title: "FM 102.5 Positiva",
    image: "https://elradar.ar/wp-content/uploads/radio-positiva-80x80.webp",
    streamUrl: "https://stream.zeno.fm/vr78b5gdm5zuv",
    searchHints: ["Positiva 102.5 Federal"],
  },
  {
    key: "sembrando-1031",
    name: "Sembrando Vidas",
    title: "FM 103.1 Sembrando Vidas",
    image: "https://elradar.ar/wp-content/uploads/sembrando-vidas-80x80.jpg",
    streamUrl: "https://autodj.nvradios.com/radio/8188/radio.mp3",
    searchHints: ["Sembrando Vidas 103.1 Federal"],
  },
  {
    key: "sonica-1077",
    name: "Sónica",
    title: "FM 107.7 Sónica",
    image: "https://elradar.ar/wp-content/uploads/Radio-Sonica-107.7-80x80.jpg",
    searchHints: ["Sónica 107.7 Federal"],
  },

  {
    key: "chamamecera-online",
    name: "Estación Chamamecera",
    title: "Estación Chamamecera (online)",
    desc: "100% chamamé, 24 horas.",
    image: "https://elradar.ar/wp-content/uploads/estacion-chamamecera-80x80.jpg",
    streamUrl: "https://sonic.host-live.com/8516/stream",
    searchHints: ["Estacion Chamamecera"],
  },
  {
    key: "lazona-online",
    name: "La Zona",
    title: "La Zona (online)",
    image:
      "https://elradar.ar/wp-content/uploads/WhatsApp-Image-2025-07-27-at-15.29.19.jpeg",
    streamUrl: "https://serverssl.deradios.stream:7112/;",
    searchHints: ["La Zona Federal"],
  },
];
