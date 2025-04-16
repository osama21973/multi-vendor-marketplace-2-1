
import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import withAuth from '../../components/auth/withAuth';

const OwnerCodeGenerator = () => {
  return (
    <PageLayout>
      <div className="container mx-auto py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Owner Permissions</CardTitle>
            <CardDescription>
              Information about owner access and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-blue-800 font-medium mb-1">Owner Access Information</h3>
                  <p className="text-sm text-blue-700">
                    Owner access is now managed directly by administrators. Users can register normally 
                    and then be granted owner status via database management.
                  </p>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Owner Role Assignment Process</h3>
                <p className="text-gray-600 mb-4">
                  The platform now uses a streamlined approach for assigning owner roles:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Users register with a standard account</li>
                  <li>An existing administrator updates the user's role to "owner" in the database</li>
                  <li>The user can then log in with full owner privileges</li>
                </ol>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h3 className="font-medium text-amber-800 mb-1">Security Notice</h3>
                <p className="text-sm text-amber-700">
                  Owner access grants full administrative control over the platform. Only trusted individuals 
                  should be granted this level of access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default withAuth({
  redirectTo: '/login',
  allowedRoles: ['owner'],
  loadWhileRedirecting: true
})(OwnerCodeGenerator);
