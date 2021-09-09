import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import NextNprogress from 'nextjs-progressbar'
import "../styles/style.css"
import "../styles/responsive.css"

function MyApp({ Component, pageProps }) {
  return <>
    <NextNprogress
        color="#F5FF00"
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
        showOnShallow={true}
    />
    <Component {...pageProps}/>
    </>

}

export default MyApp
