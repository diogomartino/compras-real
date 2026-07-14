import { AuthGoogleCallback } from '@/screens/auth-google-callback';
import { BaseList } from '@/screens/base-list';
import { Catalog } from '@/screens/catalog';
import { Categories } from '@/screens/categories';
import { Ds } from '@/screens/ds';
import { Home } from '@/screens/home';
import { Household } from '@/screens/household';
import { NotFound } from '@/screens/not-found';
import { Profile } from '@/screens/profile';
import { ResetPassword } from '@/screens/reset-password';
import { Shopping } from '@/screens/shopping';
import { ShoppingHistory } from '@/screens/shopping-history';
import { memo } from 'react';
import { Route, Routes, type Location } from 'react-router';

type TRoutingProps = {
  location?: Location;
};

const Routing = memo(({ location }: TRoutingProps) => {
  return (
    <Routes location={location}>
      <Route index element={<Home />} />

      <Route path="auth/google/callback" element={<AuthGoogleCallback />} />
      <Route path="base-list" element={<BaseList />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="categories" element={<Categories />} />
      <Route path="shop" element={<Shopping />} />
      <Route path="shopping-history" element={<ShoppingHistory />} />
      <Route path="shopping-history/:historyId" element={<ShoppingHistory />} />
      <Route path="profile" element={<Profile />} />
      <Route path="household" element={<Household />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="ds" element={<Ds />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

export { Routing };
