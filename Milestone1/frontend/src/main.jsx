import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import SignUp from './pages/sign-up/SignUp.jsx';
import Campaigns from './pages/campaigns/Campaigns.jsx';
import JoinCampaign from './pages/join-campaign/JoinCampaign.jsx';
import Campaign from './pages/campaign/Campaign.jsx';

import '../index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";


//TO DO: Secure routes only when logged in
const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "sign-up",
        element: <SignUp />
      },
      {
        path: "my-campaigns",
        element: <Campaigns />
      },
      {
        path: "join-campaign",
        element: <JoinCampaign />
      },
      {
        path: "campaign/:id",
        element: <Campaign />,
      }
    ]
  },  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
