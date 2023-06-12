import React, { FC, useContext } from 'react';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import Block from '@mui/icons-material/Block';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { CartContext, CartContextProps } from '@/contexts/cart';
import { RuleContext, RuleContextProps } from '@/contexts/rule';
import { Properties, Product as TProduct } from '@/lib/types';

interface PropType {
  properties: Properties;
  product: TProduct;
}

const Product: FC<PropType> = ({ properties, product }) => {
  const { rules, isSuccess } = useContext(RuleContext) as RuleContextProps;
  const { image, color } = properties;
  const { name, latestQuantity, id, category } = product;
  const { setCartProduct } = useContext(CartContext) as CartContextProps;

  const addToCart = () => {
    const cartProduct = {
      productId: id,
      name,
      category,
      quantity: latestQuantity,
      incart: 1,
    };
    setCartProduct(cartProduct);
  };
  return (
    <Card
      elevation={0}
      sx={{
        height: '20rem',
        display: 'flex',
        border: '1px solid #E5E8EC80',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: {
          md: 0,
        },
        bgcolor: 'white',
      }}
    >
      <svg
        viewBox="0 0 375 310"
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
          fill={color}
        />
        <rect
          y="107.48"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 0 107.48)"
          fill={color}
        />
      </svg>
      <CardContent>
        <Box
          sx={{
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
              marginBottom: '-2rem',
              marginLeft: '1.5rem',
              background: 'radial-gradient(black, transparent 60%)',
              transform: 'rotate3d(0,0,1, 20dg) scale3d(1, 0.6, 1)',
              opacity: '0.2',
            }}
          />
          <Box sx={{ width: '8rem', height: '8rem', position: 'relative' }}>
            <Image
              src={image}
              fill
              alt="product-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Box>
        </Box>
        <Divider />
        <CardActions
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            width: '13rem',
          }}
        >
          <Box style={{ color: '#000', letterSpacing: '.3px' }}>
            <Typography
              gutterBottom
              variant="body2"
              style={{ fontWeight: 'bolder', textTransform: 'capitalize' }}
            >
              {name}
            </Typography>

            <Typography
              variant="caption"
              style={{ textTransform: 'capitalize' }}
            >
              {latestQuantity}
            </Typography>
          </Box>
          {isSuccess && rules?.allowAddToCart === 'ALLOW' ? (
            <Tooltip title="Tambahkan">
              <IconButton
                style={{ backgroundColor: 'white' }}
                onClick={addToCart}
              >
                <AddShoppingCart style={{ color }} />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton style={{ backgroundColor: 'white' }} disabled>
              <Block color="secondary" />
            </IconButton>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default Product;
