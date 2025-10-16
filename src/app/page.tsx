"use client"
import { useUser } from '@/context/UserContext';
import { UserForm } from "@/components/user_form"
import { AccountForm } from '@/components/account_form';
import { Button } from '@/components/ui/button';
import { LogOut } from "lucide-react"

export default function Home() {
  const { user } = useUser();
  const { logout } = useUser();

  return (
    <main>
      <div className="flex flex-col items-center">
        {user ? (
          <>
            <Button className="absolute top-5 right-5 font-mono" onClick={logout} variant="outline">Logout <LogOut className="size-4"/></Button>
            <h1 className="text-5xl font-normal font-mono mt-20 fade-in">Welcome, {user.name}</h1>
            <h2 className="text-2xl font-normal font-mono text-muted-foreground mt-5 fade-in-slow">let's start by adding an account.</h2>
            <div className="flex flex-row justify-center w-1/2 gap-4 mt-20 mb-20 fade-in">
              <AccountForm />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-normal font-mono mt-20 fade-in">Let's Get Started</h1>
            <h2 className="text-2xl font-normal font-mono text-muted-foreground mt-5 fade-in-slow">create a new account or login to an existing one.</h2>
            <div className="flex flex-row justify-center w-1/2 gap-4 mt-20 fade-in">
              <UserForm />
            </div>
          </>
        )}
      </div>
    </main>
  );  
}
