import './globals.css';
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './_auth/forms/AuthLayout';
import { SigninForm } from './_auth/forms/SigninForm';
import { SignupForm } from './_auth/forms/SignupForm';
import { RootLayout } from './_root/RootLayout';
import { Home, Profile } from './_root/pages';

import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from './store/authStore';

const App = () => {
  const authUser = useAuthStore(state => state.user);
  return (
    <main className={`flex h-screen max-h-screen bg-slate-50 dark:bg-slate-950`}>
      {/* toaster */}
      <Toaster />

      <Routes>
        {/* public */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* protected */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/:username' element={<Profile />} />
        </Route>
      </Routes>

    </main>
  )
}

export { App };