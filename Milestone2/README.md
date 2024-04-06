# ScribeSmith
## Group I: Milestone 2

### What is done
- Image upload functionality using multer
- Authentication and authorization using JWT
- Database for Get and Post requests with User and Campaign
- MyNotes and SharedNotes pages, minus a put/post through the database. 

### What is not done
- User profile page needs to be implemented
- Cropping functionality for campaign banners or some way to only show the 1500 x 500 versions of images
- Campaign settings needs to be polished and working dynamically
- Put requests to database, persisting data for notes and tags
- Implementing more mobile friendly UI for MyNotes/SharedNotes


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
| PATCH  | /campaigns/:campaignId/description         | Change description of campaign.    |
| PATCH  | /campaigns/:campaignId/tags                | Update campaign tags.              |
| PATCH  | /campaigns/:campaignId/banner              | Upload banner image.               |
| GET    | /campaigns/:campaignId/notes/users/:userId | Get notes by creator and campaign. |
| POST   | /campaign/:campaignId/notes/users/:userId  | Create a note.                     |
| PUT    | /campaign/:campaignId/notes/users/:userId  | Update a note.                     |



| Page               | Static Status | Dynamic Status                    | Wireframe                                                                                                                                 |
| ------------------ | ------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Login Page         | ✅             | ✅                                |                                                                                                                                           |
| Create Account     | ✅             | ✅                                |                                                                                                                                           |
| My Campaigns       | ✅             | ✅                                 |                                                                                                                                           |
| Join Campaign      | ✅             | ✅ | |
| Create Campaign    | ✅           | ✅                                |           |
| Campaign Page      | ✅             | ✅                                 |                                                                                                                                           |
| My Notes           | ✅           | 50%                               | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_3.png?raw=true) |
| Shared Notes       | ✅          | 50%                                | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_4.png?raw=true) |
| User Settings       | ✅            | ✅                                |  |
| Campaign Settings  | 70%           | 60%                               | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_1.png?raw=true) |
| View Campaign Code | ✅            | ✅                                |           |
| User Settings      | ✅            | ✅                                |       

### Database ER Diagram
![](diagram.png)

### Team Member Contributions

#### Sam
- Create account and login functionality both frontend and backend with JWT
- Polished CSS for Create Campaign
- Create Campaign functionality on the frontend
- HTML/CSS for User Settings
- User settings functionality both frontend and backend
- Made pages dynamic for current logged in user and making sure pages are only shown to authorized users

#### Declan
- Added filtering by tag to NoteBrowser in MyNotes
- created SharedNotes page and added dynamic functionality
- Setup frontend logic for creating and updating notes, although it has not yet been tested due to database issues
- Added frontend UI for sharing notes
- Added frontend UI for tagging notes
- debugged issues with MyNotes communicating with database

#### Lucien
- Added more routes to routes.js and corresponding methods in API client
- Worked on database design and diagram
- Wrote the scribesmith.sql setup file
- Created Constructor and DAO files
- Wrote SQL queries (half of the routes done so far, also going to do the rest of them for the final)

