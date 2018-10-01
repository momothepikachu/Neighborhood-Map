import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
if(!navigator.serviceWorker) {
  console.log('no SW...')
};
navigator.serviceWorker.register('./sw.js').then(function(){
  console.log('Service worker registered!')
}).catch(function(){
  console.log('Service worker failed...')
})
ReactDOM.render(<BrowserRouter basename={process.env.PUBLIC_URL}><App /></BrowserRouter>, document.getElementById('root'));

