
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CommissionReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  // Protect page for owner only
  if (user?.role !== 'owner') {
    navigate('/dashboard');
    return null;
  }
  
  // Fetch commission data
  const { data: commissions, isLoading } = useQuery({
    queryKey: ['commissions', timeRange],
    queryFn: async () => {
      // Calculate date range based on selected time range
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
      }
      
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          amount, 
          status,
          payout_date,
          created_at,
          stores(name_en)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching commissions:', error);
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Prepare chart data
  const chartData = commissions ? prepareChartData(commissions, timeRange) : [];
  
  // Calculate total commissions
  const totalCommission = commissions?.reduce((total, commission) => total + Number(commission.amount), 0) || 0;
  
  // Calculate pending commissions
  const pendingCommission = commissions?.filter(comm => comm.status === 'pending')
    .reduce((total, commission) => total + Number(commission.amount), 0) || 0;

  return (
    <DashboardLayout title="Commission Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Commission Overview</h2>
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
              <p className="text-xs text-gray-500 flex items-center">
                For the past {timeRange === 'week' ? '7 days' : timeRange === 'month' ? '30 days' : '12 months'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingCommission.toFixed(2)}</div>
              <p className="text-xs text-gray-500 flex items-center">
                Not yet paid out
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Commission Chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Commission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-80 flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Commission']} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill="#4f46e5" 
                      name="Commission" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No commission data available for this period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Helper function to prepare chart data
const prepareChartData = (commissions: any[], timeRange: string) => {
  if (!commissions.length) return [];
  
  const groupedData: Record<string, number> = {};
  
  commissions.forEach(commission => {
    const date = new Date(commission.created_at);
    let key;
    
    // Group by different time periods based on timeRange
    if (timeRange === 'week') {
      // Group by day of week (Sun, Mon, etc.)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      key = days[date.getDay()];
    } else if (timeRange === 'month') {
      // Group by date within month (1-31)
      key = date.getDate().toString();
    } else {
      // Group by month for year view (Jan, Feb, etc.)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      key = months[date.getMonth()];
    }
    
    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    
    groupedData[key] += Number(commission.amount);
  });
  
  // Convert to chart format
  return Object.entries(groupedData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));
};

export default CommissionReports;
