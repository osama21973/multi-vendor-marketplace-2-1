
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XIcon, Loader2, UserIcon } from 'lucide-react';

const VendorApprovals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Protect page for owner only
  if (user?.role !== 'owner') {
    navigate('/dashboard');
    return null;
  }
  
  // Fetch pending vendors
  const { data: pendingVendors, isLoading } = useQuery({
    queryKey: ['pendingVendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, created_at')
        .eq('role', 'vendor')
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending vendors:', error);
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Mutation for approving vendors
  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ approved: true })
        .eq('id', userId);
      
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['pendingVendors'] });
      toast({
        title: "Vendor approved",
        description: "The vendor has been approved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error approving vendor:', error);
      toast({
        title: "Action failed",
        description: "There was an error approving the vendor.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for rejecting vendors
  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      // In a real app, you might want to send a notification to the vendor
      // For now, we'll just update their role back to customer
      const { error } = await supabase
        .from('users')
        .update({ role: 'customer' })
        .eq('id', userId);
      
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['pendingVendors'] });
      toast({
        title: "Vendor rejected",
        description: "The vendor application has been rejected.",
      });
    },
    onError: (error) => {
      console.error('Error rejecting vendor:', error);
      toast({
        title: "Action failed",
        description: "There was an error rejecting the vendor.",
        variant: "destructive",
      });
    }
  });
  
  const handleApprove = (userId: string) => {
    approveMutation.mutate(userId);
  };
  
  const handleReject = (userId: string) => {
    rejectMutation.mutate(userId);
  };

  return (
    <DashboardLayout title="Vendor Approvals">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <Badge variant="outline" className="py-1">
            {pendingVendors?.length || 0} pending
          </Badge>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : pendingVendors && pendingVendors.length > 0 ? (
          <div className="space-y-4">
            {pendingVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.email}</h4>
                        <p className="text-sm text-gray-500">
                          Applied {new Date(vendor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(vendor.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(vendor.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Pending Approvals
              </h3>
              <p className="text-gray-500">
                All vendor applications have been reviewed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendorApprovals;
