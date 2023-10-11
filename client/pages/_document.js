import { Html, Head, Main, NextScript } from 'next/document';


//A custom Document can update the <html> and <body> tags used to render a Page,
// To override the default Document
export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
