import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} /><iframe
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
    </ChakraProvider>
  );
}
