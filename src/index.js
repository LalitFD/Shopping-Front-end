// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <GoogleOAuthProvider clientId="124965719295-8b8v6akvhvdj72i03jbn5ih8ucud0rfb.apps.googleusercontent.com">
//       <App />
//     </GoogleOAuthProvider>
//   </BrowserRouter>
// );

// reportWebVitals();



import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
reportWebVitals();