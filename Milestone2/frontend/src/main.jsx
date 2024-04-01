import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header/Header.jsx';
import Login from './pages/login/Login.jsx';
import SignUp from './pages/sign-up/SignUp.jsx';
import Campaigns from './pages/campaigns/Campaigns.jsx';
import JoinCampaign from './pages/join-campaign/JoinCampaign.jsx';
import CreateCampaign from './pages/create-campaign/CreateCampaign.jsx';
import CampaignSettings from './pages/campaign-settings/CampaignSettings.jsx';
import Campaign from './pages/campaign/Campaign.jsx';
import MyNotes from './pages/my-notes/MyNotes.jsx';
import Note from './components/Note/Note.jsx';
import { joinCampaignAction } from './pages/join-campaign/formAction.jsx';
import { loginAction } from './pages/login/formAction.jsx';
import { signUpAction } from './pages/sign-up/formAction.jsx';


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
        element: <Login />,
        action: loginAction,
      },
      {
        path: "sign-up",
        element: <SignUp />,
        action: signUpAction
      },
      {
        path: "my-campaigns",
        element: <Campaigns />
      },
      {
        path: "join-campaign",
        element: <JoinCampaign />,
        action: joinCampaignAction
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />
      },
      {
        path: "campaigns/:id",
        element: <Campaign />,
      },
      {
        path: "campaigns/:id/settings",
        element: <CampaignSettings />,
      },
      {
        path: "my-notes/:id",
        element: <MyNotes />
      },
      {
        path: "note-debug",
        element: <Note />
      }
    ]
  },  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
