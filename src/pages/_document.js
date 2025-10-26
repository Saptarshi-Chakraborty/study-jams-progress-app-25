import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/Icon-16x9.png" type="image/png" sizes="16x9"/>
        <link rel="icon" href="/Icon-32x18.png" type="image/png" sizes="32x18"/>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
