import { Catalog } from '@/screens/catalog';
import { Ds } from '@/screens/ds';
import { Home } from '@/screens/home';
import { NotFound } from '@/screens/not-found';
import { memo } from 'react';
import { Route, Routes } from 'react-router';

const Routing = memo(() => {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="catalog" element={<Catalog />} />
      <Route path="ds" element={<Ds />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

export { Routing };
