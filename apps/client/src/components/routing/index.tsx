import { AuthGoogleCallback } from '@/screens/auth-google-callback';
import { BaseList } from '@/screens/base-list';
import { Catalog } from '@/screens/catalog';
import { Ds } from '@/screens/ds';
import { Home } from '@/screens/home';
import { NotFound } from '@/screens/not-found';
import { Profile } from '@/screens/profile';
import { ResetPassword } from '@/screens/reset-password';
import { Shopping } from '@/screens/shopping';
import { memo } from 'react';
import { Route, Routes } from 'react-router';

const Routing = memo(() => {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="auth/google/callback" element={<AuthGoogleCallback />} />
      <Route path="base-list" element={<BaseList />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="shop" element={<Shopping />} />
      <Route path="profile" element={<Profile />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="ds" element={<Ds />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

export { Routing };
