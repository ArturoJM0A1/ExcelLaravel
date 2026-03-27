import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductCatalogApp from './ProductCatalogApp.jsx';
import '../css/app.css';

createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <ProductCatalogApp />
    </React.StrictMode>,
);