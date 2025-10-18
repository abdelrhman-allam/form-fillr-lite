import { Html, Head, Main, NextScript } from 'next/document'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="application-name" content="FormFillr" />
        <meta name="description" content="FormFillr — generate realistic fake user data in the browser (JSON/CSV). Privacy-first." />
        <link rel="icon" href={`${basePath || ''}/favicon.ico`} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
