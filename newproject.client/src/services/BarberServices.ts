import { useApiService } from './apiService';

// Interface for the Barber Service data
export interface IBarberService {
    id?: number;
    name: string;
    price: number;
    durationInMinutes: number;
    category: string;
    offer: number;
    description: string;
    imageUrl: string;
}

const BARBER_SERVICES_ENDPOINT = '/BarberServicesAPI';

export const useBarberServices = () => {
    const apiService = useApiService();

    return {
        // Get all barber services
        getAllServices: async () => {
            return await apiService.get(BARBER_SERVICES_ENDPOINT);
        },

        // Get a specific barber service by ID
        getServiceById: async (id: number) => {
            return await apiService.get(`${BARBER_SERVICES_ENDPOINT}/${id}`);
        },

        // Create a new barber service
        createService: async (service: Omit<IBarberService, 'id'>) => {
            return await apiService.post(BARBER_SERVICES_ENDPOINT, service);
        },

        // Update an existing barber service
        updateService: async (id: number, service: IBarberService) => {
            return await apiService.put(`${BARBER_SERVICES_ENDPOINT}/${id}`, service);
        },

        // Delete a barber service
        deleteService: async (id: number) => {
            return await apiService.delete(`${BARBER_SERVICES_ENDPOINT}/${id}`);
        }
    };
};
