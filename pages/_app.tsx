import type { AppProps } from 'next/app'
import {composeWithDevTools} from "redux-devtools-extension";
import NextNprogress from 'nextjs-progressbar'
import {applyMiddleware, createStore} from "redux";
import Cookies from 'js-cookie'
import {Provider} from 'react-redux'
import thunk from "redux-thunk";
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import "../styles/style.css"
import "../styles/responsive.css"
import {rootReducer} from '../redux/reducers/rootReducer'

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(
        thunk
    )
))

function MyApp({ Component, pageProps }: AppProps) {
    const token:string = Cookies.get('token'),
        userId:string = Cookies.get('userId')

    return (
        <Provider store={store}>
            <NextNprogress
                color="#F5FF00"
                startPosition={0.3}
                stopDelayMs={200}
                height={5}
                showOnShallow={true}
            />
            <Component {...pageProps} token={token} userId={userId}/>
        </Provider>
    )
}

export default MyApp
