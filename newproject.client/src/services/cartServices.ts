import { useAxiosInstance } from '../config/axiosConfig';
import type { CartItem } from '../types/cart';

export const useCartServices = () => {
  const axios = useAxiosInstance();

  return {
    // Get all cart items
    getCartItems: async (): Promise<CartItem[]> => {
      try {
        const response = await axios.get('/cart');
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Add an item to cart
    addToCart: async (serviceId: number): Promise<CartItem> => {
      try {
        const response = await axios.post(`/Cart?serviceId=${serviceId}`);
        return response.data;
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    },

    // Get a specific cart item by ID
    getCartItem: async (id: number): Promise<CartItem> => {
      try {
        const response = await axios.get(`/cart/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Delete a specific cart item
    deleteCartItem: async (id: number): Promise<void> => {
      try {
        await axios.delete(`/cart/${id}`);
      } catch (error) {
        throw error;
      }
    },

    // Clear the entire cart
    clearCart: async (): Promise<void> => {
      try {
        await axios.delete('/cart/clear');
      } catch (error) {
        throw error;
      }
    }
  };
};
    
export default useCartServices;
