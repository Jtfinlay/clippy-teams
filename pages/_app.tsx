import { Provider, teamsTheme } from '@fluentui/react-northstar'; //https://fluentsite.z22.web.core.windows.net/quick-start
import '../styles/globals.css'

if (typeof document === 'undefined') {
    // @ts-ignore
    global.document = { querySelector: function () {}, };
}

function MyApp({ Component, pageProps }) {
    return (
        <Provider theme={teamsTheme}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
