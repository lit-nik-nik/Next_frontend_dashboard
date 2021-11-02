import Document, { Html, Head, Main, NextScript } from 'next/document'
import Version from "../modules/version";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head >
            <meta name="description" content="Система управления заказами" />
            <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body style={{overflowX: "hidden"}}>
          <Main />
          <NextScript />
          <Version />
        </body>
      </Html>
    )
  }
}

export default MyDocument
