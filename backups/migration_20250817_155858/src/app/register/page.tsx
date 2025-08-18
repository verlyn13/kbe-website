import { RegistrationFlow } from '@/components/registration/registration-flow';
import { PublicHeader } from '@/components/public-header';

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <RegistrationFlow />
        </div>
      </main>
    </>
  );
}