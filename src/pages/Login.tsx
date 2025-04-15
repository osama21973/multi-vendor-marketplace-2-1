
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const ownerLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  ownerCode: z.string().min(6, { message: "Owner code must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OwnerLoginFormValues = z.infer<typeof ownerLoginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOwnerCode } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("user");

  const userForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const ownerForm = useForm<OwnerLoginFormValues>({
    resolver: zodResolver(ownerLoginSchema),
  });

  const onUserSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onOwnerSubmit = async (data: OwnerLoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First verify the owner code
      const isOwner = await verifyOwnerCode(data.ownerCode);
      
      if (!isOwner) {
        toast({
          variant: "destructive",
          title: "Invalid owner code",
          description: "The owner code you entered is not valid."
        });
        setError('Invalid owner code. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // If owner code is valid, proceed with login
      await login(data.email, data.password);
      
      toast({
        title: "Welcome, Owner!",
        description: "You've successfully logged in as a platform owner."
      });
      
      navigate('/owner/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-200px)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User/Vendor</TabsTrigger>
                <TabsTrigger value="owner">Platform Owner</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user">
                <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      placeholder="name@example.com"
                      type="email"
                      {...userForm.register('email')}
                    />
                    {userForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="user-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-marketplace-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="user-password"
                      type="password"
                      {...userForm.register('password')}
                    />
                    {userForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-marketplace-primary hover:bg-marketplace-secondary" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="owner">
                <form onSubmit={ownerForm.handleSubmit(onOwnerSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email</Label>
                    <Input
                      id="owner-email"
                      placeholder="owner@example.com"
                      type="email"
                      {...ownerForm.register('email')}
                    />
                    {ownerForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{ownerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="owner-password">Password</Label>
                    <Input
                      id="owner-password"
                      type="password"
                      {...ownerForm.register('password')}
                    />
                    {ownerForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{ownerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="owner-code">Owner Code</Label>
                    <Input
                      id="owner-code"
                      type="text"
                      placeholder="Enter your owner verification code"
                      {...ownerForm.register('ownerCode')}
                    />
                    {ownerForm.formState.errors.ownerCode && (
                      <p className="text-red-500 text-sm mt-1">{ownerForm.formState.errors.ownerCode.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      The recommended owner code format is: OWNER-XXXX-XXXX-XXXX
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-marketplace-primary hover:bg-marketplace-secondary" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in as Owner
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">
                Don't have an account?{' '}
              </span>
              <Link 
                to="/signup" 
                className="text-marketplace-primary hover:text-marketplace-secondary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-5">
            <div className="text-xs text-gray-500">
              Protected by reCAPTCHA and subject to the{' '}
              <Link to="/privacy" className="text-marketplace-primary hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="text-marketplace-primary hover:underline">
                Terms of Service
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
