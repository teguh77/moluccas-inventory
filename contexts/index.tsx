import { ChildrenProps } from '@/lib/types';
import { AuthProvider } from './auth';
import { CartProvider } from './cart';
import { CartNotifProvider } from './cartnotif';
import { CategoryProvider } from './category';
import { ProductProvider } from './product';
import { RefetchProvider } from './RefetchHelper';

export default function MainContext({ children }: ChildrenProps) {
  return (
    <RefetchProvider>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              <CartNotifProvider>{children}</CartNotifProvider>
            </CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </RefetchProvider>
  );
}
