import { useEffect, useState } from 'react';
import { useCartServices } from '../../services/cartServices';
import type { CartItem } from '../../types/cart';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

const Carts = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cartServices = useCartServices();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const items = await cartServices.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await cartServices.deleteCartItem(id);
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 container mx-auto px-0 md:px-6 lg:px-8 max-w-7xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Your Cart
          </h1>
          {cartItems.length > 0 && (
            <span className="text-sm text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any services yet.</p>
            <Button variant="outline" className="hover:bg-gray-100">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4 transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
                      {item.serviceImageUrl && (
                        <div className="relative w-full sm:w-24 h-32 sm:h-24">
                          <img
                            src={item.serviceImageUrl}
                            alt={item.serviceName}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          {/* Mobile Remove Button - Absolute positioned on image */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 sm:hidden bg-red-600 text-white hover:bg-red-700 cursor-pointer p-2 rounded-md"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex w-full justify-between items-start">
                          {/* Left side: Service name + price */}
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {item.serviceName}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{item.servicePrice.toFixed(2)}
                            </p>
                          </div>

                          {/* Desktop Remove button - Hidden on mobile */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hidden sm:flex bg-red-600 text-white hover:bg-red-700 cursor-pointer px-4 py-1 rounded-md"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          Added on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Order Summary */}
            <div className="lg:w-96">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      ₹{cartItems.reduce((sum, item) => sum + item.servicePrice, 0).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ₹{cartItems.reduce((sum, item) => sum + item.servicePrice, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-3 mt-6">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => cartServices.clearCart().then(() => setCartItems([]))}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Carts;
