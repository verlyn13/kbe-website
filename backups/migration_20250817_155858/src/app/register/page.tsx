import { PublicHeader } from '@/components/public-header';
import { RegistrationFlow } from '@/components/registration/registration-flow';

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <main className="bg-background min-h-screen">
        <div className="container py-8">
          <RegistrationFlow />
        </div>
      </main>
    </>
  );
}
