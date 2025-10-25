import { useApiService } from './apiService';

/**
 * Offer types matching the /Offers API response
 */
export interface Offer {
    id: number;
    type: string | null;
    name: string;
    description?: string | null;
    discount?: number | null;
    validTillText?: string | null;
    validTillDate?: string | null; // ISO string
    numberOfUses?: number | null;
    festivalName?: string | null;
    dayName?: string | null;
    isActive?: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface CreateOfferDTO {
    type?: string | null;
    name: string;
    description?: string | null;
    discount?: number | null;
    validTillText?: string | null;
    validTillDate?: string | null;
    numberOfUses?: number | null;
    festivalName?: string | null;
    dayName?: string | null;
    isActive?: boolean;
}

export interface UpdateOfferDTO extends Partial<CreateOfferDTO> {}

/**
 * Hook that exposes Offer-related API calls.
 * Usage:
 *   const offerService = useOfferService();
 *   const offers = await offerService.getOffers();
 */
export const useOfferService = () => {
    const api = useApiService();

    return {
        getOffers: async (): Promise<Offer[]> => {
            return await api.get('/Offers');
        },

        getOffer: async (id: number): Promise<Offer> => {
            return await api.get(`/Offers/${id}`);
        },

        createOffer: async (payload: CreateOfferDTO): Promise<Offer> => {
            return await api.post('/Offers', payload);
        },

        updateOffer: async (id: number, payload: UpdateOfferDTO): Promise<Offer> => {
            return await api.put(`/Offers/${id}`, payload);
        },

        deleteOffer: async (id: number): Promise<void> => {
            await api.delete(`/Offers/${id}`);
        }
    };
};

export default useOfferService;
