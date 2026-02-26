import { api } from "@/lib/axios";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// ─── Models ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  tutorProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Review {
  id: string;
  rating: string; // backend returns Decimal as string e.g. "4.5"
  comment: string | null;
  studentId: string;
  tutorProfileId: string;
  createdAt: string;
  student?: Pick<User, "id" | "name" | "image">;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number;
  experience: number;
  categoryId: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email" | "image">;
  category: Category;
  availability?: AvailabilitySlot[];
  reviews?: Review[];
}

// ─── Request shapes ───────────────────────────────────────────────────────────

export interface TutorsQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface TutorsResponse {
  tutors: TutorProfile[];
  pagination: {
    totalTutors: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  categories: Category[]; 
}

export interface UpdateProfilePayload {
  bio?: string;
  hourlyRate?: number;
  experience?: number;
  categoryId?: string;
}

export interface UpdateAvailabilityPayload {
  date: string;
  startTime: string;
  endTime: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const tutorService = {
  async getAll(query?: TutorsQuery): Promise<TutorsResponse> {
    const { data } = await api.get("/api/tutors", { params: query });
    return data; // { success, message, tutors, pagination }
  },

  async getById(id: string): Promise<TutorProfile> {
    const { data } = await api.get(`/api/tutors/${id}`);
    return data;
  },

  // Returns bare array OR wrapped — handle both safely
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get("/api/categories");
    // If backend returns { categories: [...] }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<TutorProfile> {
    const { data } = await api.put("/api/tutor/profile", payload);
    return data;
  },

  async updateAvailability(slots: UpdateAvailabilityPayload[]): Promise<void> {
    await api.put("/api/tutor/availability", { slots });
  },
};