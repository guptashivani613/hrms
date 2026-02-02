import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from 'react-redux';
import { store } from "./redux/store";

// Render the app wrapped with QueryClientProvider
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
      <App />
  </Provider>,
);

// Report web vitals (optional)
reportWebVitals();
