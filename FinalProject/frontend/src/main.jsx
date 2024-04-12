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
import SharedNotes from './pages/shared-notes/SharedNotes.jsx'
import Note from './components/Note/Note.jsx';
import { joinCampaignAction } from './pages/join-campaign/formAction.jsx';
import { loginAction } from './pages/login/formAction.jsx';
import { signUpAction } from './pages/sign-up/formAction.jsx';
import '../index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserSettings from './pages/user-settings/UserSettings.jsx';
import { userSettingsAction } from './pages/user-settings/formAction.jsx';
import { createCampaignAction } from './pages/create-campaign/formAction.js';
import { campaignSettingsAction } from './pages/campaign-settings/formAction.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "sign-up",
        element: <SignUp />,
        action: signUpAction
      },
      {
        path: "/",
        element: <Campaigns /> 
      },
      {
        path: "/user-settings",
        element: <UserSettings />,
        action: userSettingsAction
      },
      {
        path: "join-campaign",
        element: <JoinCampaign />,
        action: joinCampaignAction
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
        action: createCampaignAction
      },
      {
        path: "campaigns/:campaignId",
        element: <Campaign />,
      },
      {
        path: "campaigns/:campaignId/settings",
        element: <CampaignSettings />,
        action: campaignSettingsAction
      },
      {
        path: "campaigns/:campaignId/my-notes",
        element: <MyNotes />
      },
      {
        path: "campaigns/:campaignId/shared-notes",
        element: <SharedNotes />
      },   
         
      // {
      //   path: "campaigns/:campaignId/shared-notes",
      //   element: <SharedNotes />
      // },
      {
        path: "note-debug",
        element: <Note />
      }
    ]
  },  
]);

const theme = createTheme({
  palette: {
    primary: {
      main: '#9b6fcb', //purple
      dark: '#7c59a2',
    },
    secondary: {
      main: '#91ffde' //light blue/teal
    },
    background: {
      main: '#252328',
      dark: '#19181c',
      light: '#494251'
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
