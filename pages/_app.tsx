import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import type { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar'
import "../styles/style.css"
import "../styles/responsive.css"
import Cookies from 'js-cookie'

function MyApp({ Component, pageProps }: AppProps) {
    const token:string = Cookies.get('token'),
        userId:string = Cookies.get('userId')

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
