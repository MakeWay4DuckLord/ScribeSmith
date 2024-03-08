# ScribeSmith
## Group I: Milestone 1


### What is done

- Most pages are at least statically implemented and link to each other.
    
- All finalized API routes work with mock data, allowing us to simulate running the application.
    
- React router set up to serve frontend pages.
    
- Most pages that need to receive data from backend populate fully.
    
- Join campaign form works - this is an important proof-of-concept for getting our forms to talk to backend - and correctly delivers error messages from backend when needed.
    

### What is not done

- Shared Notes page - statically implemented version has not been merged yet because we’re trying to get it working dynamically first.
    
- Most of our forms and post requests aren’t implemented yet, but we have a proof of concept.
    
- Authentication - going to learn this in class after break, which will allow us to finalize our api endpoints.  

| Method | Route                                      | Description                        |
| ------ | ------------------------------------------ | ---------------------------------- |
| POST   | /authenticate                              | authenticate a user                |
| POST   | /users                                     | Create a user.                     |
| GET    | /users/:userId                             | Get a user by id.                  |
| GET    | /users/:userId/campaigns                   | Get campaigns a user is in.        |
| POST   | /users/:userId/campaigns                   | Join a campaign.                   |
| POST   | /campaigns                                 | Create a campaign.                 |
| GET    | /campaigns/:campaignId                     | Get a campaign by id.              |
| DELETE | /campaigns/:campaignId/users/:userId       | Remove player from campaign.       |
| PATCH  | /campaigns/:campaignId/description         | Change description of campaign.    |
| PATCH  | /campaigns/:campaignId/tags                | Update campaign tags.              |
| PATCH  | /campaigns/:campaignId/banner              | Upload banner image.               |
| GET    | /campaigns/:campaignId/notes/users/:userId | Get notes by creator and campaign. |
| GET    | /users/:userId/tags/campaigns/:campaignId  | Get a users tags for a campaign.   |
| POST   | /campaign/:campaignId/notes/users/:userId  | Create a note.                     |




| Page               | Static Status | Dynamic Status                    | Wireframe                                                                                                                                 |
| ------------------ | ------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Login Page         | ✅             | 0%                                |                                                                                                                                           |
| Create Account     | ✅             | 0%                                |                                                                                                                                           |
| My Campaigns       | ✅             | ✅                                 |                                                                                                                                           |
| Join Campaign      | ✅             | ✅ | |
| Create Campaign    | 90%           | 0%                                | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_2.png)          |
| Campaign Page      | ✅             | ✅                                 |                                                                                                                                           |
| My Notes           | 60%           | 50%                               | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_3.png?raw=true) |
| Shared Notes       | 60%           | 0%                                | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_4.png?raw=true) |
| User Profile       | 0%            | 0%                                | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_4.png?raw=true) |
| Campaign Settings  | 70%           | 60%                               | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_1.png?raw=true) |
| View Campaign Code | 0%            | 0%                                | [wireframe](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupI/blob/main/Proposal/Wireframes/desktop_wireframes_2.png)          |
| User Settings      | 0%            | 0%                                | None                                                                                                                                      |


### Team Member Contributions

#### Sam

* Set up React project with React Router
* Finished the static login page
* Finished the static sign up page
* Finished the static and dynamic My Campaigns page
* Finished the static and dynamic Join Campaign page
* Finished the static and dynamic campaign page
* Started static components for the my notes/shared notes pages
* Created retrieve user, retrieve user’s campaigns API endpoints



#### Declan

* Created the MyNotes page.
* Created NoteBrowser component.
* Created the Note component.
* Created the TextEditor component.
* Made the CampaignSettings page.
* Started SharedNotes page, which is still on on its feature branch.

#### Lucien

* Implemented almost all API routes with mock data
* Made the Create Campaign page
* Pair programmed on form debugging
* Pair programmed on the Note component & associated debugging and refactoring

#### Milestone Effort Contribution

Sam | Declan | Lucien
------------- | ------------- | --------------
46%            | 27%            | 27%
