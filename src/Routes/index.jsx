import { createBrowserRouter } from 'react-router-dom';
import Template from '../Layouts/Template'; 
import Dashboard from '../Pages/Dashboard';
import Index from '../Pages/Index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Template />, 
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: 'ticket',
        element: <Index />
      }
    ]
  }
]);
