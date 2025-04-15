// src/pages/owner/OwnerCodeGenerator.tsx
import { useUser, withAuth } from '@lovable/react';
import { generateOwnerCode } from '@/lib/lovable';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OwnerCodeGenerator = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [codes, setCodes] = useState<string[]>([]);

  // Verify owner role on load
  useEffect(() => {
    if (!isLoading && user?.role !== 'owner') {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleGenerateCode = async () => {
    try {
      const newCodes = await generateOwnerCode();
      setCodes(newCodes);
    } catch (error) {
      console.error('Code generation failed:', error);
    }
  };

  if (isLoading || user?.role !== 'owner') {
    return <div>Loading...</div>;
  }

  return (
    <div className="owner-dashboard">
      <h1>Owner Code Generator</h1>
      <button onClick={handleGenerateCode} className="generate-button">
        Generate New Owner Codes
      </button>
      
      {codes.length > 0 && (
        <div className="code-list">
          <h2>Generated Codes:</h2>
          <ul>
            {codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Lovable.dev authentication HOC
export default withAuth({
  redirectTo: '/login',
  allowedRoles: ['owner'],
})(OwnerCodeGenerator);
