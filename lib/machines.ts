export const machines = [
  {
    id: "1",
    name: "Chargeuse sur pneus",
    image: "/materials/chargeuse_sur_pneus.jpg",
  },
  {
    id: "2",
    name: "Compactor double bill",
    image: "/materials/compactor_double_bill.jpg",
  },
  {
    id: "3",
    name: "Excavator",
    image: "/materials/Excavator.jpg",
  },
  {
    id: "4",
    name: "Machine de forage",
    image: "/materials/Machine_de_forage.jpg",
  },
  {
    id: "5",
    name: "Roller compactor",
    image: "/materials/Roller_compactor.jpg",
  },
  {
    id: "6",
    name: "Tractopelle",
    image: "/materials/Tractopelle.jpg",
  },
  {
    id: "7",
    name: "Trailer pump",
    image: "/materials/Trailer_pump.jpg",
  },
  {
    id: "8",
    name: "Mini chargeur à pneus",
    image: "/materials/Mini_chargeur_pneus.jpg",
  },
  {
    id: "9",
    name: "Niveleuse",
    image: "/materials/Niveleuse.jpg",
  },
  {
    id: "10",
    name: "Auto chargement bétonnière",
    image: "/materials/Auto_chargement_betonniere.jpg",
  },
  {
    id: "11",
    name: "Vibro Hammer",
    image: "/materials/Vibro_Hammer.jpg",
  },
] as const;

export type Machine = (typeof machines)[number];
