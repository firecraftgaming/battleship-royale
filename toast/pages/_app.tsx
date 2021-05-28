import React from "react";
import "../styles/global.css";
import { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, user-scalable=no, user-scalable=0"
            />
            {
                /*
                    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="apple-touch-icon" href="/img/doge.png"></link>
                    <link rel="apple-touch-startup-image" href="img/doge512.png" />
                */
            }
        </Head>
        <Component {...pageProps} />
    </>
  );
}

export default App;