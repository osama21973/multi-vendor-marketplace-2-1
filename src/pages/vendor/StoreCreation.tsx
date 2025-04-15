
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const storeFormSchema = z.object({
  nameEn: z.string().min(3, {
    message: "Store name must be at least 3 characters.",
  }),
  nameAr: z.string().min(3, {
    message: "Arabic store name must be at least 3 characters.",
  }),
  categoryId: z.string({
    required_error: "Please select a store category.",
  }),
  logoUrl: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const StoreCreation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch store categories
  const { data: categories } = useQuery({
    queryKey: ['storeCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .order('name_en', { ascending: true });
      
      if (error) {
        console.error('Error fetching store categories:', error);
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      categoryId: "",
      logoUrl: "",
    },
  });

  const onSubmit = async (values: StoreFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create the store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          name_en: values.nameEn,
          name_ar: values.nameAr,
          owner_id: user!.id,
          category_id: parseInt(values.categoryId),
          logo_url: values.logoUrl || null,
          // Default values handled by database
        })
        .select('id')
        .single();
      
      if (storeError) {
        throw storeError;
      }
      
      toast({
        title: "Store created successfully",
        description: "You can now start adding products to your store.",
      });
      
      // Navigate to vendor dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        title: "Store creation failed",
        description: "There was an error creating your store. Please try again.",
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
            <CardTitle className="text-2xl">Create Your Store</CardTitle>
            <CardDescription>
              Set up your store information to start selling on our marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Store Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="اسم المتجر" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {language === 'ar' ? category.name_ar : category.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Store
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <p className="text-sm text-gray-500">
              You'll be able to manage your store from your dashboard after creation.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default StoreCreation;
