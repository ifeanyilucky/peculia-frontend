export const SPECIALTIES = [
  { id: "lash_tech", label: "Lash Technician" },
  { id: "makeup_artist", label: "Makeup Artist" },
  { id: "hairstylist", label: "Hairstylist" },
  { id: "nail_tech", label: "Nail Technician" },
  { id: "brow_artist", label: "Brow Artist" },
  { id: "esthetician", label: "Esthetician" },
  { id: "other", label: "Other" },
] as const;

export type Specialty = (typeof SPECIALTIES)[number]["id"];
