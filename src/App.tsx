import './globals.css';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './_auth/forms/AuthLayout';
import { SigninForm } from './_auth/forms/SigninForm';
import { SignupForm } from './_auth/forms/SignupForm';
import { RootLayout } from './_root/RootLayout';
import { Home } from './_root/pages';

import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <main className={`flex h-screen `}>
      <Routes>
        {/* public */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
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