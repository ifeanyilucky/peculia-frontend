import { useQuery } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";

export interface Specialty {
  id: string;
  label: string;
  icon: string;
  thumbnail?: string;
}

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties", "general"],
    queryFn: async () => {
      const categories = await serviceService.getGeneralCategories();
      return categories.map(
        (cat): Specialty => ({
          id: cat.specialtyId,
          label: cat.name,
          icon: cat.icon || "LayoutGrid",
          thumbnail: cat.thumbnail,
        }),
      );
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
