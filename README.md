Live coding practice interview question
=======================================

## Overview

This is a FullStack Todo Application, the client is based on [Todo MVC](http://todomvc.com/)

- Stack:
  - Client: Basic jQuery selectors, event-handlers, DOM manipulation and AJAX
  - Web Server: Node and Express with Mongoose 
  - Database: Mongo hosted by [MLab](mlab.com)
  - Tests: Mocha, Chai, Chai-Http and Chai-Spies

## The "Rules"

You should attempt to complete this challenge without looking at any other resources such as googling, stack-overflow, documentation or course materials. However, you may look at any of the files in the project including the schema in the `models.js` file and the integration tests in `test/server.test.js` and you may ask the interviewer clarifying questions at any point.

### 3 Lifelines
- If you get stuck, you have 3 lifelines (like "Who Wants to Be a Millionaire")
  - 1) Online documentation - browse Express, Mongoose, Chai, Chai-Http docs
  - 2) Interview Hint - Ask the interviewer for a hint
  - 3) Google search - one time google search including stack-overflow and docs

## Setup

- Go to `mLab.com` and create a new Sandbox database
- Create a User for this database:  
  - Click "Users" tab and then click "Add database user"
  - Enter "Username" and "Password"
- Copy the `mongodb://...` URI to the `.env` file in this project

```
DATABASE_URL=mongodb://<USER>:<PASSWORD>@ds112345.mlab.com:12345/<DBNAME>
```

- Open the "Logs" in this project
- You should see output from 10 integration tests, some will be failing.

## Exercise

- Create a new file name `todosRouter.js`
- Move all the endpoints from `server.js` to `todosRouter.js`
- Require the proper modules into `todosRouter.js` and export the router
- In `server.js`, mount the router on `/v1/todos/` path (aka mount point).
- Remember to update the paths on the router files.

You have completed the task when all the unit tests pass and the client application works without any errors.
