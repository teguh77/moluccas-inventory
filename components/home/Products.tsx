import React from 'react';
import Grid from '@mui/material/Grid';
import { Product as TProduct, Properties } from '@/lib/types';
// material ui
import Product from './Product';

import Loading from '@/components/Loading';

const getProperties = (category: string) => {
  const properties: Properties = {
    image: '',
    color: '',
  };
  switch (category) {
    case 'alat tulis kantor':
      properties.image = '/images/atk.png';
      properties.color = '#00666690';
      break;
    case 'alat kebersihan':
      properties.image = '/images/alat-kebersihan.png';
      properties.color = '#4d4dff90';
      break;
    case 'alat kendaraan':
      properties.image = '/images/alat-kendaraan.png';
      properties.color = '#ff333390';
      break;
    case 'alat komputer':
      properties.image = '/images/alat-komputer.png';
      properties.color = '#ffa50090';
      break;
    case 'obat obatan':
      properties.image = '/images/box.png';
      properties.color = '#00800090';
      break;
    default:
      properties.image = '/images/others.png';
      properties.color = '#883dbd90';
      break;
  }
  return properties;
};

type PropTypes = {
  isLoading: boolean;
  isSuccess: boolean;
  products: TProduct[];
};

const Products = (props: PropTypes): JSX.Element => {
  const { isLoading, isSuccess, products } = props;
  return (
    <main style={{ padding: products?.length === 0 ? '8%' : 0 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid
          container
          sx={{ justifyContent: 'flex-start', padding: { xs: '0 2.5rem' } }}
          spacing={4}
        >
          {isSuccess &&
            products?.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Product
                  product={product}
                  properties={getProperties(product.category)}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </main>
  );
};

export default Products;

// TODO : pindahkan fetch product ke index dan setting pagination dan filtering
