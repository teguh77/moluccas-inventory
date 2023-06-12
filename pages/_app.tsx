import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../styles/theme';
import createEmotionCache from '../lib/createEmotionCache';
import '@/styles/globals.css';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainContext from '@/contexts';
import Layout from '@/components/Layout';

axios.defaults.withCredentials = true;

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <MainContext>
          <Head>
            <title>Apps | Inventory</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <Layout>
              <CssBaseline />
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </MainContext>
      </CacheProvider>
    </QueryClientProvider>
  );
}
