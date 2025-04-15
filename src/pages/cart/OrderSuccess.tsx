
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
              You will receive an email confirmation shortly.
            </p>
            
            <div className="space-x-4">
              <Button onClick={() => navigate('/orders')}>View Orders</Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default OrderSuccess;
