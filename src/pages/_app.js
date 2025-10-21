import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?display=swap&family=Space+Grotesk:wght@400;500;700');
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
