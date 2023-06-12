import React from 'react';
import { useRouter } from 'next/router';
import CustomDrawer from '@/components/drawer/CustomDrawer';
import { NotifProvider } from '@/contexts/notif';
import { RuleProvider } from '@/contexts/rule';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => {
  const { pathname } = useRouter();
  const authRoutes = ['/login', '/404'];
  const authRoute = authRoutes.includes(pathname);
  return authRoute ? (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ marginBottom: '10rem' }}>{children}</main>
      <Footer />
    </div>
  ) : (
    <RuleProvider>
      <NotifProvider>
        <CustomDrawer>
          <main>{children}</main>
          <Footer />
        </CustomDrawer>
      </NotifProvider>
    </RuleProvider>
  );
};

export default Layout;
