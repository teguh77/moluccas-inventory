/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Star from '@mui/icons-material/Star';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { TStockOut } from '@/lib/types';

import Loading from '../Loading';

type Props = {
  stocks?: TStockOut[];
};

const Popular = ({ stocks }: Props) => {
  const [loading, setLoading] = useState(true);
  const [popularData, setPopularData] = useState<TStockOut[]>([]);

  const setData = () => {
    const dateNow = new Date();
    const getMonthNow = dateNow.getMonth();
    const productByMonth = stocks?.filter((cart) => {
      const { createdAt } = cart;
      const dateProduct = new Date(createdAt);
      const getMonthProduct = dateProduct.getMonth();
      return getMonthProduct === getMonthNow;
    });

    const sortedProduct = productByMonth?.sort(
      (a, b) => b.quantity - a.quantity,
    );
    const pickedProducts = sortedProduct?.slice(0, 3);
    setPopularData(pickedProducts || []);
  };

  useEffect(() => {
    if (!stocks) {
      setLoading(true);
    } else {
      setData();
      setLoading(false);
    }
  }, [stocks]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : popularData?.length !== 0 ? (
        <Grid container spacing={1} style={{ padding: '0.5rem 1rem' }}>
          {popularData.map((popular) => (
            <Grid item xs={12} key={popular.id}>
              <Card
                style={{
                  minHeight: '3rem',
                }}
                elevation={0}
              >
                <CardHeader
                  style={{ textTransform: 'capitalize' }}
                  avatar={
                    <Avatar
                      aria-label="popular"
                      style={{ backgroundColor: 'white' }}
                    >
                      <Star color="primary" />
                    </Avatar>
                  }
                  title={popular.name}
                  subheader={popular.category}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '14rem',
          }}
        >
          <Typography variant="body2">Barang Kosong.</Typography>
        </div>
      )}
    </>
  );
};

export default Popular;
