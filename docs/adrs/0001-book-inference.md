## Book Inference Architecture

## Status: Draft

## Context

Sovoli is heavily reliant on machine learning to help users manage their books and their reading habits.

ML are inference systems, which is probability and may or may not be correct.

The first part of the user's journey is to input the books they own into the system. We want to make this so easy that it accepts a book image and infers the book title, author, and ISBN.

THe system will try to resolve the inference by sending this data to API to get the top 5 books that match the inference data.

We will link to the first book in the list as the book that the inference system thinks is the best match until the user validates the inference.

Concepts:

1. Automatic inference validation - this validation is done by the systems such as API calls to google books api and OpenLibrary API.
2. Manual validation - this is done by the user. This will flag the book as verified.

### Issues

Currently, the API for the shelf also accepts this information, which can be a list of books of over 100 books.

Each book has to make a request to google books api.

For each book that google books returns, we need to make another request to OpenLibrary API to get more data, the cover image and author.

As you can imagine, this is a very expensive operation and we are already running into our serverless timeout issues with just 30 books and the google books api.

We need to come up with system design that will allow us to do this with 2 principles in mind:

1. Scalable (no timeouts)
2. Good user feedback (users should see the progress of the inference process)
3. Cheap (batching whenever we can)

## Design

Lets start with some high level design:

Scenario 1: Fresh start, no books on the shelf.

Scenario 2: Updating an existing shelf, some books are already validated on the shelf, new books are being added.


### Architecture

* API accepts a list of books.
  * the book can be inference data (title, author, isbn)
  * the book can be a known ISBN 
* Where this list is possible:
  * Shelf `PUT /users/:username/shelves/:slug`
  * List `PUT /users/:username/lists/:slug`
  * Books `PUT /users/:username/books/:slug`

This means that each individual book should user submitted book (`my-book` in the db) should handle its own inference resolution and validation.


### Db schema on insertion

We will need to store temporary data on myBooks such as what the book is inferred to be when chatGPT parses the book image.

Add a few columns:

1. `name` - the title that the inference system thinks is the best match. This will be updated as we link the book.
2. `inferredAuthor` - the author that the inference system thinks is the best match
3. `triggerDevId` - the trigger dev handle id thats handling the inference population.
4. `inferredIsbns` - the list of ISBNs that the inference system thinks are the best match
5. `verified` - a boolean that will be set to true when the inference is validated by user.
6. `inferenceError` - the error that the inference system encountered, if any.
7. `inferenceSystems` - the list of inference systems that the inference system uses to validate the inference. ie. googleBooks, openLibrary, etc

`slug` and `bookId` will be null until automatic inference validation is done.

Questions:

If the same book is added with inferred title and author, what should happen?

### Flow

1. User adds a book to `my-books` table with inference data.
2. 
