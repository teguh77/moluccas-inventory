/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Block from '@mui/icons-material/Block';
import AddBox from '@mui/icons-material/AddBox';
import IndeterminateCheckBox from '@mui/icons-material/IndeterminateCheckBox';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import { CartContext, CartContextProps } from '@/contexts/cart';

import GeneralModal from '../modal/GeneralModal';

type Props = {
  productId: string;
  name: string;
  image: string;
  color: string;
  quantity: number;
  incart: number;
};

const Product = ({
  productId,
  name,
  image,
  color,
  quantity,
  incart,
}: Props) => {
  const { cart, setNewCart } = useContext(CartContext) as CartContextProps;
  const [productQuantity, setProductQuantity] = useState(incart);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  const increase = () => {
    if (productQuantity > quantity) {
      setProductQuantity(quantity);
    } else {
      setProductQuantity((prev: number) => prev + 1);
    }
  };
  const decrease = () => {
    if (productQuantity <= 1) {
      setProductQuantity(1);
      setOpenModalConfirm(true);
    } else {
      setProductQuantity((prev: number) => prev - 1);
    }
  };

  useEffect(() => {
    const updatedProduct = cart.map((c) =>
      c.productId === productId ? { ...c, incart: productQuantity } : c,
    );
    setNewCart(updatedProduct);
  }, [productQuantity]);

  const handleRemove = () => {
    const updatedCart = [];
    updatedCart.push(...cart);
    const filteredCart = updatedCart.filter((c) => c.productId !== productId);
    setNewCart(filteredCart);
  };

  return (
    <Card
      sx={{
        height: '20rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: {
          xs: '0 2.5rem',
          md: 0,
        },
        bgcolor: color,
      }}
    >
      <svg
        viewBox="0 0 375 283"
        fill="none"
        style={{
          transform: 'scale(1.5)',
          opacity: '0.1',
          position: 'absolute',
          bottom: '0',
          left: '0',
          marginBottom: '2rem',
        }}
      >
        <rect
          x="159.52"
          y="175"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 159.52 175)"
          fill="white"
        />
        <rect
          y="107.48"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 0 107.48)"
          fill="white"
        />
      </svg>
      <CardContent>
        <div
          style={{
            position: 'relative',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '12rem',
          }}
        >
          <div
            style={{
              display: 'block',
              position: 'absolute',
              width: '10rem',
              height: '10rem',
              bottom: '0',
              left: '0',
              right: '0',
              marginBottom: '-1rem',
              marginLeft: '2.3rem',
              background: 'radial-gradient(black, transparent 60%)',
              transform: 'rotate3d(0,0,1, 20dg) scale3d(1, 0.6, 1)',
              opacity: '0.2',
            }}
          />
          <Box sx={{ width: '8rem', height: '8rem', position: 'relative' }}>
            <Image
              src={image}
              fill
              alt="product-image-cart"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Box>
        </div>

        <CardActions
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '.5rem',
            minWidth: '13.5rem',
          }}
        >
          <Box
            style={{
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '.5rem',
            }}
          >
            <Typography
              variant="body2"
              align="left"
              style={{
                fontWeight: 'bold',
                letterSpacing: '.5px',
                textTransform: 'capitalize',
              }}
            >
              {name}
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <IconButton onClick={decrease}>
                <IndeterminateCheckBox />
              </IconButton>
              <Typography variant="body2" style={{ margin: '0 .5rem' }}>
                {incart}
              </Typography>
              <IconButton
                onClick={increase}
                disabled={quantity - productQuantity === 0}
              >
                {quantity - productQuantity === 0 ? <Block /> : <AddBox />}
              </IconButton>
            </div>
          </Box>
          <Paper
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '0.5rem',
              color,
            }}
            elevation={8}
          >
            <Typography variant="caption">Tersedia</Typography>
            <Typography variant="body2">
              {quantity - productQuantity}
            </Typography>
          </Paper>
        </CardActions>
      </CardContent>
      <GeneralModal
        handler={handleRemove}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text={`Hapus ${name} ?.`}
        type="confirm"
      />
    </Card>
  );
};

export default Product;
