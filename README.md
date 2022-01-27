This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

# Task Board

**Hosted on Firebase**  
https://task-board-184e1.web.app/

NOTE: API may take time to start if it has been in an idle state for some time. This can take up to a couple of minutes.

## Summary

This project was built to meet the follow set of user stories:

- As a user, I can view all lists and tasks which have been created
- As a user, I can create an empty list with a name property
- As a user, I can delete an entire list with all its tasks

- As a user, I can add new tasks to an existing list with a name, description and deadline properties
- As a user, I can update the name, description and deadline of a task within a list
- As a user, I can move a single task to a different list
- As a user, I can move multiple tasks to a different list in a single transaction
- As a user, I can delete a task from a list
- As a user, I can delete multiple tasks from a list in a single transaction
- As a user, I can complete a task

- As a user, I will receive an email (mock this functionality by logging to stdout) when a task is completed
- As a user, I will receive an email (mock this functionality by logging to stdout) when a task passes it's deadline

The mocked email for overdue tasks logs on the task-board-api, rather than the frontend, however on querying for a list of a tasks, a log will be displayed for any tasks which are marked as overdue at that point.

## Architecture

### Client

To accomplish the above, a React-Redux frontend, deployed to Firebase, allows the user to interact with data fetched from the API using Axios. The returned data is dispatched to the store, and any subsequent queries also trigger updates to the store in addition to writing to the database, giving the user the impression of instant updates. This idea is inspired by Apollo Client's cache and optimistic response features.

### API

The client interacts with an Express based REST API hosted on Azure, which serves a limited set of endpoints (see https://github.com/jp-1990/task-board-api). An interval runs on this server to check, and update, the 'overdue' property of a task once the deadline has passed.

### Database

The endpoints exposed by this API allow the caller to interact with a PostgreSQL database, also hosted on Azure, storing the required data in a one-to-many relationship. A list may have many tasks, and as such, the foreign key on a task relates to the primary key of a list (both named list_id). Cascading updates and deletes are enabled to provide the functionality to delete all tasks connected to a list when the list is deleted.

## Technologies Used

- TypeScript
- React
- Redux
- Axios
- Express
- Azure
- Firebase
- PostgreSQL

## User Interactions

In order to move tasks between lists, the user must drag and drop them. Multiple tasks may be selected at once, and can be dragged and dropped within their list, or into another list. Their existing order will be maintained. Tasks may only be selected from one list at a time.

Multi-selection is handled via modifier keys. Ctrl/cmd+click to select specific tasks or shift+click to select a range.
