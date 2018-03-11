import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd';

import './style/antd.css'
import './style/index.css';
import App from './App';
import Spanish from 'antd/lib/locale-provider/es_ES';
import Store from './Store'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(

    <Provider store={Store}>
        <BrowserRouter>
            <LocaleProvider locale={Spanish}>
                <App />
            </LocaleProvider>
        </BrowserRouter>
    </Provider>


, document.getElementById('root'));
registerServiceWorker();
