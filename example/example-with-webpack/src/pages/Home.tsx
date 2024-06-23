import React from 'react';
import Footer from '../components/Footer';
// const Navbar = React.lazy(() => import('exampleVite/Navbar'));

const Home = () => {
  return <>
  <div className='home'>
    {/* <Navbar /> */}
    <h1>This is a content in react + webpack website</h1>
    <Footer />
  </div>
  </>;
};

export default Home;