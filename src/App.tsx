import './globals.css';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './_auth/forms/AuthLayout';
import { LoginForm } from './_auth/forms/LoginForm';
import { SignupForm } from './_auth/forms/SignupForm';
import { RootLayout } from './_root/RootLayout';
import { Home } from './_root/pages';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const App = () => {
  return (
    <main className={`flex h-screen `}>
      <Routes>
        {/* public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>

        {/* protected */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

      {/* toaster */}
      <Toaster />
    </main>
  )
}

export { App };