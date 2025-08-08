import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'

import {BrowserRouter} from 'react-router'
import ScrollToTop from './components/ScrollToTop';

import { Toaster } from 'react-hot-toast'
import store from './redux/store.ts'


import { setupAxiosInterceptors } from './Helpers/axiosInstance.js';


setupAxiosInterceptors(store);
console.log(import.meta.env.VITE_BACKEND_API_URL);



createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
        <ScrollToTop />
             <App />
             <Toaster />
        </BrowserRouter>
    </Provider>
)
