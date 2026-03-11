import api from "@/lib/axios";

export interface CategoryData {
  _id: string;
  name: string;
  isGeneral: boolean;
  color?: string;
  icon?: string;
  order: number;
  specialtyId: string;
  isActive: boolean;
  thumbnail?: string;
}

export const serviceService = {
  getGeneralCategories: async (): Promise<CategoryData[]> => {
    const response = await api.get("/services/categories/general");
    return response.data.data;
  },
};
