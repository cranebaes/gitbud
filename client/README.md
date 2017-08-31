## Login/Signup

- The landing page is the entry point to the app.
- Handled by the Landing react component, the user has the option to login with Github.
- Clicking the login button will send a GET request to the url /auth/github.
- If this is the user's first time, the user will be routed to the Questionnaire component.
  - This logic is handled App component, where a check is made to see if the user's loggedIn state has certain properties.
- If the user has logged in before, then they will be redirected to a project list page.

## Questionniare

- This page asks the user for:
    - Experience Level
    - Interested Language
    - Profile Descripion
- This info is stored in the user's node in the database and is displayed in the user's profile.
- After completing the questionnaire, user is taken to the Project List page.

## Project List

- This can be considered the home page.
- The list of available projects to work on will be displated
- Clicking on a project will have 2 possibe outcomes:
    - If the user is not working on the project, they will be taken to the project details page.
    - If the user is already working on the project with a pair, they will be taken to the Project Status page.
- This logic is handled inside a 'smart' Project container.
- The container checks the user's state to see whether the user is paired on a project or not, and renders the appropriate component.

## Project Details

- This page displays information about a project such description, link to GitHub repo, and a list of recommended users to pair with.
- An Interest button allows user to express interest in the project.
- The Project Details component uses a UserList Component to display a list of recommended users who have also expressed interest in the project.
- The list is sorted by an aglorithm on the server side that calculates the difference in coding activity by language between users.
- Clicking on a recommended user will route the user to the User Details component

## User Details

- This page displays user information collected from the questionnaire by a user
- There are options to message the user, and pairing with the user.
- Pairing with a user will establish a pairing between the 2 users, represented by a PAIRED_WITH relationship in neo4j.
- The 2 users will also officially start working on the project, established by a WORKING_ON relationship in neo4j.
- The next time the user clicks the Project through the the project list page, they will be taken to the Project Status page.

## Project Status

- This page has multiple checkboxes to that allow users to track their project progress.
- Clicking 'Submit Progress' after checking checkboxes will save the users progress.
- The next time the user enters the Project Status component, the boxes will remain checked.
- This page also comes with a socket.io chat allowing the partnered users to collaborate on the project together in realtime.

## My Projects

- This component is accessible through the app bar.
- It displays the list of projects the user is currently WORKING_ON

## My Partners

- This component is accessible through the app bar.
- It displays the list of users the currently logged in user is partnered with.

## My Account

- This component is accessible through the app bar
- It displays the user's information that was entered in the questionnaire
