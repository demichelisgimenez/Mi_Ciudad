export type UsefulPhoneItem = {
  id: string;
  label: string;
  phone: string;
  description?: string;
};

export type UsefulPhoneCategory = {
  id: string;
  title: string;
  icon: string;
  items: UsefulPhoneItem[];
};

export const USEFUL_PHONE_CATEGORIES: UsefulPhoneCategory[] = [
  {
    id: "emergencias",
    title: "Emergencias",
    icon: "warning-amber",
    items: [
      {
        id: "policia-101",
        label: "Policía",
        phone: "101",
        description: "Emergencias policiales",
      },
      {
        id: "bomberos-100",
        label: "Bomberos",
        phone: "100",
        description: "Incendios y rescates",
      },
      {
        id: "ambulancia-107",
        label: "Ambulancia",
        phone: "107",
        description: "Emergencias médicas",
      },
    ],
  },
  {
    id: "salud",
    title: "Salud",
    icon: "local-hospital",
    items: [
      {
        id: "hospital-guardia",
        label: 'Hospital "J. J. de Urquiza"',
        phone: "03454421004",
        description: "Guardia y urgencias",
      },
      {
        id: "hospital-psiquiatrico",
        label: 'Hosp. Psiquiátrico "R. Caminos"',
        phone: "03454427200",
        description: "Guardia",
      },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad",
    icon: "security",
    items: [
      {
        id: "policia-jefatura",
        label: "Policía Jefatura Dptal.",
        phone: "03454421519",
        description: "Guardia Federal",
      },
      {
        id: "gendarmeria",
        label: "Gendarmería Nacional",
        phone: "03454422488",
      },
    ],
  },
  {
    id: "municipio-servicios",
    title: "Municipio y servicios",
    icon: "location-city",
    items: [
      {
        id: "municipalidad-despacho",
        label: "Municipalidad de Federal",
        phone: "03454421116",
        description: "Atención al vecino",
      },
      {
        id: "obras-sanitarias",
        label: "Obras Sanitarias",
        phone: "03454421398",
        description: "Agua y cloacas",
      },
      {
        id: "enersa-0800",
        label: "ENERSA Emergencias",
        phone: "08007770080",
        description: "Cortes y problemas eléctricos",
      },
      {
        id: "gasnea-emer",
        label: "GAS NEA – Emergencias",
        phone: "0800777427632",
        description: "Pérdida de gas y urgencias",
      },
    ],
  },
  {
    id: "transporte",
    title: "Transporte",
    icon: "directions-bus-filled",
    items: [
      {
        id: "terminal-omnibus",
        label: "Terminal de Ómnibus",
        phone: "03454422520",
        description: "Horarios y pasajes",
      },
      {
        id: "taxis-remises",
        label: "Remises / Taxis",
        phone: "03454421494",
        description: "Referencia TV Cable Federal",
      },
    ],
  },
  {
    id: "tramites",
    title: "Trámites",
    icon: "description",
    items: [
      {
        id: "registro-civil",
        label: "Registro Civil",
        phone: "03454421915",
        description: "DNI, actas y certificados",
      },
      {
        id: "correo-argentino",
        label: "Correo Argentino",
        phone: "03454421032",
        description: "Paquetes y envíos",
      },
    ],
  },
];
