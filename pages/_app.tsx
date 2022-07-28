import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import Snackbar from '../components/layout/Snackbar/Snackbar';
import { store } from '../RTKQ/store';
import '../styles/globals.scss';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
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
        <Snackbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
