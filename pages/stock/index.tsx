import React, { ChangeEvent, useState } from 'react';
import Search from '@mui/icons-material/Search';
import Category from '@mui/icons-material/Category';
import PostAdd from '@mui/icons-material/PostAdd';
import Summarize from '@mui/icons-material/Summarize';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MobileAppbar from '@/components/stock/MobileAppbar';
import { Product } from '@/lib/types';

import CategoryDialog from '@/components/stock/dialog/CategoryDialog';
import ProductDialog from '@/components/stock/dialog/ProductDialog';
import StockDialog from '@/components/stock/dialog/StockDialog';
import StockTable from '@/components/stock/StockTable';

const Stock = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items: Product[]) => items,
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value;
    setFilterFn({
      fn: (items) => {
        if (target === '') return items;
        return items.filter((i) => i.name.toLowerCase().includes(target));
      },
    });
  };

  const ActionButtons = () => {
    return (
      <ButtonGroup variant="contained" size="small">
        <Tooltip title="Tambah Kategori" placement="top">
          <Button onClick={() => setOpenCategory(true)}>
            <Category />
          </Button>
        </Tooltip>
        <Tooltip title="Tambah Barang" placement="top">
          <Button onClick={() => setOpenProduct(true)}>
            <Summarize />
          </Button>
        </Tooltip>
        <Tooltip title="Tambah Stok" placement="top">
          <Button onClick={() => setOpenStock(true)}>
            <PostAdd />
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  };
  return (
    <>
      <div style={{ width: '100%' }}>
        <Box
          sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}
        >
          <MobileAppbar handleSearch={handleSearch} />
        </Box>
        <Grid
          container
          style={{ flexGrow: 1 }}
          sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              margin: { md: '0 0 1.5rem' },
              alignItems: 'center',
            }}
          >
            <Paper
              component="form"
              sx={{
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '17rem', md: '25rem' },
                height: 40,
                borderRadius: 20,
                border: '1px solid #E5E8EC',
              }}
              elevation={0}
            >
              <InputBase
                style={{ marginLeft: '1rem', flex: 1 }}
                placeholder="Cari..."
                onChange={handleSearch}
              />
              <IconButton style={{ padding: 10 }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              margin: { xs: '1.5rem 0 1.5rem', md: '0 0 1.5rem' },
            }}
          >
            <ActionButtons />
          </Grid>
        </Grid>
        <StockTable filterFn={filterFn} />
      </div>
      <CategoryDialog
        openCategory={openCategory}
        setOpenCategory={setOpenCategory}
      />
      <ProductDialog
        openProduct={openProduct}
        setOpenProduct={setOpenProduct}
      />
      <StockDialog openStock={openStock} setOpenStock={setOpenStock} />
    </>
  );
};

export default Stock;
