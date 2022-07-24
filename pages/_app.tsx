import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'dark',
        },
      })}
    >
      <Head>
        <title>Socialize</title>
        <meta
          name='description'
          content='Socialize with people from all around the world!'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
