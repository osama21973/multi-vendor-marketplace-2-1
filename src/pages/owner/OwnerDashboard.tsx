
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, DollarSign, ShoppingBag, Store, LineChart } from 'lucide-react';

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    pendingVendors: 0,
    activeStores: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCommissions: 0
  });
  
  // Placeholder for actual data fetching
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Mock data - would be replaced with actual API calls
        setStats({
          pendingVendors: 5,
          activeStores: 28,
          totalOrders: 156,
          totalRevenue: 15670.50,
          totalCommissions: 1567.05
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/owner/approvals">
                <UserCheck className="mr-2 h-4 w-4" />
                Vendor Approvals
              </Link>
            </Button>
            <Button asChild>
              <Link to="/owner/commissions">
                <DollarSign className="mr-2 h-4 w-4" />
                Commission Reports
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Store className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-sm font-medium">Active Stores</p>
                <p className="text-2xl font-bold">{stats.activeStores}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <UserCheck className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <p className="text-sm font-medium">Pending Approvals</p>
                <p className="text-2xl font-bold">{stats.pendingVendors}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <ShoppingBag className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium">Commission Revenue</p>
                <p className="text-2xl font-bold">${stats.totalCommissions.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chart visualization will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Activity timeline will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage platform vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Vendor management UI will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Detailed sales breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sales analytics UI will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default OwnerDashboard;
