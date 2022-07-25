import type { NextPage } from 'next';
import Navbar from '../components/layout/Navbar';

const Home: NextPage = () => {
  return <Navbar.Authenticated />;
};

export default Home;
