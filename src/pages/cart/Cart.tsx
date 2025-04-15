
import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products before proceeding to checkout.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/products')}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Cart implementation will go here</p>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleCheckout}>Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Cart;
