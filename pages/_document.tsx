import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body><iframe
        className="responsive-iframe"
        src="https://mesh-xi.vercel.app/"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",

          border: "none",
          zIndex: -1,
        }}
      ></iframe> 
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
