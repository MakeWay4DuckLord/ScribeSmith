# ScribeSmith

## Group I: Final Project

### What is done
- User authentication: Sign-up, Login, Logout
- Users can upload a profile picture
- Users can create new campaigns, and upload a banner image for it.
- The DM of a campaign can remove players, and change campaign settings.
- Players can join campaigns using a join code generated when the campaign was created.
- Users can create, edit, tag, and share notes.
- Users can view all of the notes they created in a given campaign, as well as all the notes that have been shared with them.
- Notes can be filtered by tags.
- Campaigns can be deleted.
- Offline functionality for viewing content.
- Installble.
### What is not done
- A few minor styling issues, especially on mobile, including some that impact accessibility (blue text on purple for sign up button on Apple mobile devices)
- The custom skin for styling TinyMCE stopped working after adding service worker, but the default light mode isn't horrible.
- MyNotes/Shared notes are empty instead of redirecting to the login page when a user is not logged in.

### Authentication
Our application uses JWT for authentication. When an account is created the password is hashed with a sha512 algorithm and the salt is stored in the database. When the user logs in, the password is decoded using the salt and a cookie is created for the web session. All of the routes use a TokenMiddleware that checks if the user is authenticated before they can be called. On the frontend, if a user isn’t authenticated, the app redirects them to the login page. Also, if the user tries to view a campaign they’re not a part of, an error page is displayed.

### Pages and Offline Functionality
![](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/FinalProject/flowchart.png)

Offline, users can view the campaigns they are a part of, as well as the My Notes and Shared Notes for those campaigns, as long as those things have been cached. No PUT or POST requests are available offline, meaning that Join/Create Campaign and User/Campaign Settings are viewable but not submittable.

Users can navigate between pages by clicking labeled buttons. User Settings and Login are available from any page by hovering/tapping the profile icon in the upper right corner and selecting ‘User Settings’ or ‘Logout’.

| Page               | Static Status | Dynamic Status                    | Wireframe                                                                                                                                 |
| ------------------ | ------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Login Page         | ✅             | ✅                                |                                                                                                                                           |
| Create Account     | ✅             | ✅                                |                                                                                                                                           |
| My Campaigns       | ✅             | ✅                                 |                                                                                                                                           |
| Join Campaign      | ✅             | ✅ | |
| Create Campaign    | ✅           | ✅                                |           |
| Campaign Page      | ✅             | ✅                                 |                                                                                                                                           |
| My Notes           | ✅           | ✅                              |  |
| Shared Notes       | ✅          | ✅                               |  |
| User Settings       | ✅            | ✅                                |  |
| Campaign Settings  | ✅           | ✅                               |  |
| View Campaign Code | ✅            | ✅                                |           |
| User Settings      | ✅            | ✅                                |       

### API

| Method | Route                                      | Description                        |
| ------ | ------------------------------------------ | ---------------------------------- |
| POST   | /authenticate                              | authenticate a user                |
| POST   | /users/logout                              | log out current user               |
| POST   | /users                                     | Create a user.                     |
| GET    | /users/current | gets the currently authenticated user.                         |
| GET    | /users/:userId                             | Get a user by id.                  |
| GET    | /users/:userId/icon                        | Get a user's icon                  |
| PUT    | /users/:userId                             | Update a user's settings.          |
| GET    | /users/:userId/campaigns                   | Get campaigns a user is in.        |
| POST   | /users/:userId/campaigns                   | Join a campaign.                   |
| POST   | /campaigns                                 | Create a campaign.                 |
| GET    | /campaigns/:campaignId                     | Get a campaign by id.              |
| GET    | /campaigns/:campaignId/banner              | Get a campaign's banner by campaign id.     |
| DELETE | /campaigns/:campaignId/users/:userId       | Remove player from campaign.       |
| PATCH  | /campaigns/:campaignId        | Update a campaign.    |
| GET    | /campaigns/:campaignId/notes/users/:userId | Get notes by creator and campaign. |
| POST   | /campaigns/:campaignId/notes/users/:userId  | Create a note.                     |
| PUT    | /campaigns/:campaignId/notes/users/:userId  | Update a note.                     |
| DELETE | /campaigns/:campaignId | Delete a campaign. |

### ER Diagran

![](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/dwsmith7/final-project-tweaks/Milestone2/diagram.png)

### Team Member Contributions

#### Sam Stone

##### Milestone 1

* Set up React project with React Router

* Finished the static login page

* Finished the static sign up page

* Finished the static and dynamic My Campaigns page

* Finished the static and dynamic Join Campaign page

* Finished the static and dynamic campaign page

* Started static components for the my notes/shared notes pages

* Created retrieve user, retrieve user’s campaigns API endpoints

  

##### Milestone 2

* Create account and login functionality both frontend and backend with JWT

* Polished CSS for Create Campaign

* Create Campaign functionality on the frontend

* HTML/CSS for User Settings

* User settings functionality both frontend and backend

* Made pages dynamic for current logged in user and making sure pages are only shown to authorized users

* Added image uploading functionality for profile pictures and campaign banners

##### Final Project

* Fixed multiple bugs that had come up after the API routes were updated in Milestone 2.

* Fixed create account, user settings, displaying profile pictures in My Notes, viewing campaigns that you’ve created, and fixed the note previews showing HTML instead of text.

* Added offline functionality for all of the GET requests while gracefully redirecting the user to the offline page when necessary 

* Made the app installable by setting up the manifest and all of the required icons

*  Implemented the campaign settings page

  

#### Lucien Koger

##### Milestone 1

* Implemented almost all API routes with mock data

* Made the Create Campaign page

* Pair programmed on form debugging

* Pair programmed on the Note component & associated debugging and refactoring

##### Milestone 2

* Added more routes to routes.js and corresponding methods in API client

* Worked on database design and diagram

* Wrote the scribesmith.sql setup file

* Created Constructor and DAO files

* Wrote SQL queries (half of the routes done so far, also going to do the rest of them for the final)

##### Final Project

* Rewrote the rest of routes.js to work with database

* Finished Note, Campaign, and User DAO

* Added error handling and data validation in backend

* Patched a few issues in frontend during integration

* Led integration testing and deployment

  

#### Declan Smith

##### Milestone 1

* Created the MyNotes page.

* Created NoteBrowser component.

* Created the Note component.

* Created the TextEditor component.

* Made the CampaignSettings page.

* Started SharedNotes page, which was still on on its feature branch.

  

##### Milestone 2

* Added filtering by tag to NoteBrowser in MyNotes

* created SharedNotes page and added dynamic functionality

* Setup frontend logic for creating and updating notes, although it has not yet been tested due to database issues

* Added frontend UI for sharing notes

* Added frontend UI for tagging notes

* debugged issues with MyNotes communicating with database

##### Final Project

* Finished implementation for NoteBrowser and Note components for MyNotes and SharedNotes pages.

* Overhauled the styling of Notes and related pages:

* the note feed is now a drawer that can be opened and closed while on smaller screens

* SharedNotes no longer displays buttons for sharing/saving/tagging notes that are not yours.

* added limit to the vertical length of NotePreviews

* added ellipsis when text overflows NotePreviews.

* made CampaignTags scrollable when they overflow.

* Pair programmed with Lucien on many of the more tricky database issues.

* Fixed majority of issues Lucien found during integration testing and deployment


#### Project Effort Contribution

Milestone   | Sam | Lucien | Declan
----------- | ------------- | ------------- | --------------
Milestone 1 | 46%            | 27%            | 27%
Milestone 2 | 34%            | 33%            | 33%
Final       | 40%            | 30%            | 30%
----------- | ------------- | ------------- | --------------
TOTAL:      | 120%      | 90%      | 90%

shoutout to @Sam, ScribeSmith mvp
