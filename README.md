# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Project overview

Creating Kanban view clone with the following features

## Create tasks

You should be able to create tasks with title and description to the end of columns that have enabled adding tasks functionality

## Move tasks

You should be able to move tasks from one to another column via drag and drop. Also you should be able sort tasks by placing them above or below existing tasks.

## Remove tasks

You should be able to remove tasks by clicking remove button on task component.

## Persistent storage

You should be able to toggle saving board state in local storage by clicking on checkbox. State should persist after application refreshes.

# Motivation

Drag and drop was done from scratch. It might be done with using `reeact-beautiful-dnd` library.
Used Context API instead of Redux because Context is more suitable for light-weight solutions.
Whole board logic was hidden inside useKanbanBoard hook along with kanbanBoardContext for clearer interaction via typed API provided by useKanbanBoardContext and for providing better reusability.
