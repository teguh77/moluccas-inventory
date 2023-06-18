/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';
import Head from 'next/head';
import Products from '@/components/cart/Products';
import { CartContext } from '@/contexts/cart';
import { CartContextType } from '@/lib/types';
import { RuleContext, RuleContextProps } from '@/contexts/rule';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/contexts/auth';

import Confirm from '@/components/cart/Confirm';
import Waiting from '@/components/cart/Waiting';

function getSteps() {
  return [
    'Mengajukan Permohonan',
    'Menunggu Validasi RT',
    'Konfirmasi Barang Diterima',
  ];
}

const Cart = () => {
  const { skip }: CartContextType = useContext(CartContext) as CartContextType;
  const { rules, isSuccess, isError } = useContext(
    RuleContext,
  ) as RuleContextProps;
  const [skipped] = skip;
  const steps = getSteps();
  const router = useRouter();
  const { authenticated } = useAuthState();
  const isStepSkipped = (step: any) => {
    return skipped.has(step);
  };

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

  function getStepContent(step: any) {
    switch (step) {
      case 1:
        return <Products rules={rules} isSuccess={isSuccess} />;
      case 2:
        return <Waiting />;
      case 3:
        return <Confirm rules={rules} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <Head>
        <title>Inventory | Cart</title>
      </Head>
      {isSuccess && (
        <div style={{ width: '100%' }}>
          <Stepper
            activeStep={rules?.activeStep && rules?.activeStep - 1}
            style={{ backgroundColor: 'inherit' }}
          >
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Divider style={{ margin: '1rem 0' }} />
          <div style={{ marginTop: '6rem', marginBottom: '6rem' }}>
            <div>{getStepContent(rules?.activeStep)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
