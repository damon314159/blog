# API Design

This API has been designed with RESTful principles in mind

## Users

#### POST

- `/users` - Creates a new user
- `/users/login` - Logs in a user returning a JWT bearer auth token
- `/users/logout` - Logs out a user

#### PUT

- `/users/:uuid/roles` - Edits a user's roles. Requires admin permissions

## Posts

#### GET

- `/posts` - Retrieve all posts, including author's username
- `/posts/:uuid` - Retrieve specific post, including author's username and all comments

#### POST

- `/posts` - Create a new post. Requires author role

#### PUT

- `/posts/:uuid` - Edits a post. Requires user to be the post's author

#### DELETE

- `/posts/:uuid` - Deletes a post. Requires user to be the post's author or an admin

## Comments

#### POST

- `/posts/:post-uuid/comments` - Create a new comment on a given post

#### PUT

- `/posts/:post-uuid/comments/:uuid` - Edits a comment. Requires user to be the comment's author

#### DELETE

- `/posts/:post-uuid/comments/:uuid` - Deletes a comment. Requires user to be the comment's author or an admin
