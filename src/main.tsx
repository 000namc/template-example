import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import { ArtifactGallery } from './components/ArtifactGallery';
import { ArtifactRunner } from './components/ArtifactRunner';
import { ErrorPage } from './components/ErrorPage';


// Create router with our routes
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <ArtifactGallery />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/a/:artifactName',
      element: <ArtifactRunner />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/standalone/:artifactName',
      element: <ArtifactRunner standalone={true} />,
      errorElement: <ErrorPage />,
    },
    {
      // Catch-all redirect for any other routes
      path: '*',
      element: <ErrorPage />,
    },
  ],
  {
    // Use the correct base URL for GitHub Pages deployment
    basename: import.meta.env.BASE_URL,
  }
);

// Handle GitHub Pages SPA routing redirect
if (import.meta.env.PROD) {
  // Check if we were redirected from 404.html
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    window.history.replaceState(null, null, redirect);
  }
  
  // Also handle the query string redirect pattern
  const search = window.location.search;
  if (search && search[1] === '/') {
    const decoded = search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
      window.location.pathname + decoded + window.location.hash
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
