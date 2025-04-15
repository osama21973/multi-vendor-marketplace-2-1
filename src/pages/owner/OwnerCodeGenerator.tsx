// src/pages/owner/OwnerCodeGenerator.tsx
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, RefreshCw, CheckCircle } from 'lucide-react';

const OwnerCodeGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Check if current user is an owner
  if (user?.role !== 'owner') {
    navigate('/login');
    return null;
  }
  
  const generateOwnerCode = async () => {
    setIsGenerating(true);
    try {
      // Create a formatted code that's easy to read and type
      const prefix = 'OWNER';
      const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const segment3 = Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const code = `${prefix}-${segment1}-${segment2}-${segment3}`;
      
      // Store in database
      const { error } = await supabase
        .from('owner_codes')
        .insert({
          code: code,
          used: false
        });
      
      if (error) {
        throw error;
      }
      
      setGeneratedCode(code);
      toast({
        title: "Code Generated",
        description: "New owner code has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating owner code:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate owner code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    toast({
      title: "Code Copied",
      description: "Owner code has been copied to clipboard."
    });
    
    // Reset copy state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Owner Code Generator</CardTitle>
            <CardDescription>
              Generate secure codes that allow others to register as platform owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="mb-4 text-gray-600">
                  Owner codes are single-use passcodes that grant owner privileges to new users. 
                  Share these codes securely with trusted individuals who need full platform access.
                </p>
                
                <Button 
                  onClick={generateOwnerCode}
                  disabled={isGenerating}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Generate New Code
                </Button>
              </div>
              
              {generatedCode && (
                <div className="border rounded-md p-4">
                  <Label htmlFor="owner-code" className="text-sm font-medium mb-2 block">
                    Generated Owner Code (click to copy)
                  </Label>
                  <div className="flex">
                    <Input 
                      id="owner-code"
                      value={generatedCode} 
                      readOnly
                      className="font-mono bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={copyToClipboard}
                    >
                      {isCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This code can only be used once. Store it securely and share it only with trusted individuals.
                  </p>
                </div>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h3 className="font-medium text-amber-800 mb-1">Security Notice</h3>
                <p className="text-sm text-amber-700">
                  Owner codes grant full administrative access to your platform. Never share these codes publicly or with unauthorized individuals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};
// Change this line (line 8):
//export default withAuth(OwnerCodeGenerator);

// To:
export default withAuth({
  redirectTo: '/login',
  allowedRoles: ['owner'], // Add this
  loadWhileRedirecting: true // Optional loading state
})(OwnerCodeGenerator);
