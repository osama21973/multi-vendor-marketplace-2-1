
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const vendorFormSchema = z.object({
  businessName: z.string().min(3, {
    message: "Business name must be at least 3 characters.",
  }),
  businessEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  businessPhone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
  businessDescription: z.string().min(20, {
    message: "Please provide a description of at least 20 characters.",
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const VendorOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login', { replace: true });
    return null;
  }
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      businessName: "",
      businessEmail: user.email || "",
      businessPhone: "",
      businessDescription: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: VendorFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update user role to vendor
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ role: 'vendor' })
        .eq('id', user.id);
      
      if (userUpdateError) {
        throw userUpdateError;
      }
      
      // Store vendor profile data for future use
      localStorage.setItem('vendor_profile', JSON.stringify({
        businessName: values.businessName,
        businessEmail: values.businessEmail,
        businessPhone: values.businessPhone,
        businessDescription: values.businessDescription,
      }));
      
      toast({
        title: "Vendor application submitted",
        description: "Your application has been submitted and is pending approval.",
      });
      
      // Navigate to create store page
      navigate('/vendor/store/create');
    } catch (error) {
      console.error('Error submitting vendor application:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Become a Vendor</CardTitle>
            <CardDescription>
              Fill out this form to apply as a vendor on our marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@yourbusiness.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your business, products, and expertise..." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the vendor terms and conditions
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <p className="text-sm text-gray-500">
              Your application will be reviewed within 1-2 business days.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default VendorOnboarding;
