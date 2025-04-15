
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Loader2, ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  store: {
    id: string;
    name: string;
  };
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  trackingNumber?: string;
}

const getStatusColor = (status: OrderDetails['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        // We'll implement this when we have the real backend connected
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for now
        setOrder({
          id: id || '1001',
          date: '2023-04-15T08:30:00',
          status: 'delivered',
          items: [
            {
              id: 'item1',
              productId: 'prod1',
              productName: 'Wireless Headphones',
              price: 79.99,
              quantity: 1,
              image: 'https://placehold.co/100x100'
            },
            {
              id: 'item2',
              productId: 'prod2',
              productName: 'Bluetooth Speaker',
              price: 49.99,
              quantity: 1,
              image: 'https://placehold.co/100x100'
            }
          ],
          subtotal: 129.98,
          shipping: 5.99,
          tax: 10.82,
          total: 146.79,
          store: {
            id: 'store1',
            name: 'Electronics Hub'
          },
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
            country: 'United States'
          },
          paymentMethod: {
            type: 'Credit Card',
            last4: '4242'
          },
          trackingNumber: 'TRK123456789'
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Failed to load order",
          description: "Could not retrieve order details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrderDetails();
    }
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }
  
  if (!order) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <p className="mb-6">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link to="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Button variant="ghost" className="p-0 mr-4" asChild>
                <Link to="/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">Order {order.id}</h1>
            <p className="text-gray-500">Placed on {formatDate(order.date)}</p>
          </div>
          
          {order.status === 'shipped' && order.trackingNumber && (
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Purchased from {order.store.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.productName} 
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{order.paymentMethod.type}</p>
                  {order.paymentMethod.last4 && (
                    <p className="text-sm text-gray-500">
                      Ending in {order.paymentMethod.last4}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderDetails;
