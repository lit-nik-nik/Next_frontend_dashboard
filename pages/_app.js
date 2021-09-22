import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import NextNprogress from 'nextjs-progressbar'
import "../styles/style.css"
import "../styles/responsive.css"
import Cookies from 'js-cookie'
import exitApp from "../modules/exit";

function MyApp({ Component, pageProps }) {
    const token = Cookies.get('token'),
        userId = Cookies.get('userId')

  return (
    <>
      <NextNprogress
        color="#F5FF00"
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
        showOnShallow={true}
      />
      <Component {...pageProps} token={token} userId={userId}/>
    </>
  )
}

export default MyApp
