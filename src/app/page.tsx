import { redirect } from 'next/navigation';
import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background">
      <div className="flex w-full max-w-4xl flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h1 className="text-3xl font-bold text-primary">KBE</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Welcome to the Explorer's Portal
          </h2>
          <p className="text-muted-foreground max-w-md">
            Your gateway to session calendars, student progress, weekly challenges, and important announcements. Let the exploration begin!
          </p>
        </div>
        <Card className="w-full max-w-sm md:w-1/2 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
