/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Products from '../components/home/Products';
import { Product } from '../lib/types';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/contexts/auth';
import { ProductContext, ProductContextProps } from '@/contexts/product';
import { CategoryContext, CategoryContextProps } from '@/contexts/category';
import MobileAppbar from '@/components/home/MobileAppbar';

import Loading from '@/components/Loading';
import { RefetchContext, RefetchProps } from '@/contexts/RefetchHelper';
import { GetServerSideProps } from 'next';
import { verifyAuth } from '@/lib/auth';

// icons

const Gallery = () => {
  const { products, isLoading, isSuccess } = useContext(
    ProductContext,
  ) as ProductContextProps;
  const {
    categories,
    isError,
    isSuccess: catSuccess,
  } = useContext(CategoryContext) as CategoryContextProps;

  const router = useRouter();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (isError) {
      if (authenticated) {
        throw new Error();
      } else {
        router.push('/login');
      }
    }
  }, [isError, authenticated]);

  useEffect(() => {
    router.prefetch('/login');
  }, [router]);

  const postsPerPage = 8;
  const [category, setCategory] = useState('');
  const [filterFn, setFilterFn] = useState({
    fn: (items: Product[] | []) => items,
  });
  const [filterFc, setFilterFc] = useState({
    fc: (items: Product[] | []) => items,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfPage = Math.ceil(
    (isSuccess && products?.length! / postsPerPage) || 1,
  );

  const handlePageChange = (_e: any, val: number) => {
    setCurrentPage(val);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value;
    setFilterFn({
      fn: (items) => {
        if (target === '') return items;
        return items.filter((i) => i.name.toLowerCase().includes(target));
      },
    });
  };

  const handleCategoryFilter = (value: string) => {
    setCategory(value);
    setFilterFc({
      fc: (items) => {
        if (value === '' || !value) return items;
        return items.filter((i) => i.category.toLowerCase().includes(value));
      },
    });
  };
  return (
    <Box>
      <Box
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <MobileAppbar
          category={category}
          categories={categories}
          handleCategoryFilter={handleCategoryFilter}
          handleSearch={handleSearch}
        />
      </Box>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: { md: 'space-between' },
          alignItems: { md: 'center' },
        }}
      >
        <Paper
          component="form"
          sx={{
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            height: 40,
            borderRadius: 5,
            width: '25rem',
            border: '1px solid #E5E8EC',
            marginBottom: 0,
          }}
          elevation={0}
        >
          <InputBase
            sx={{
              flex: 1,
              marginLeft: '1rem',
            }}
            placeholder="Cari..."
            onChange={handleSearch}
          />
          <IconButton style={{ padding: 10 }} aria-label="search" size="small">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Paper
          component="form"
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            width: '14rem',
          }}
          elevation={0}
        >
          <FormControl
            variant="outlined"
            sx={{ minWidth: '14rem', margin: '1rem' }}
            size="small"
          >
            <InputLabel id="demo-simpl">Kategori</InputLabel>
            <Select
              labelId="demo-simpl"
              id="demo-simpl"
              value={category}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              label="Category"
              style={{ textTransform: 'capitalize', borderRadius: 5 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {catSuccess &&
                categories?.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.title}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {cat.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>
      <Box sx={{ marginTop: { md: '2rem' } }}>
        {isLoading ? (
          <Loading />
        ) : (
          isSuccess &&
          products && (
            <Products
              products={filterFn
                .fn(filterFc.fc(products))
                .slice(
                  (currentPage - 1) * postsPerPage,
                  (currentPage - 1) * postsPerPage + postsPerPage,
                )}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          )
        )}
      </Box>
      <Box
        style={{
          marginTop: '4rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pagination
          count={numberOfPage}
          variant="outlined"
          shape="rounded"
          color="primary"
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default Gallery;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { authorization } = req.cookies;
    const verifiedToken =
      authorization &&
      (await verifyAuth(authorization).catch((error) => {
        console.log(error);
      }));

    if (!verifiedToken) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
