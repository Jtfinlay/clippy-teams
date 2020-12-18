import { Provider, teamsTheme } from '@fluentui/react-northstar'; //https://fluentsite.z22.web.core.windows.net/quick-start
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <Provider theme={teamsTheme}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp
