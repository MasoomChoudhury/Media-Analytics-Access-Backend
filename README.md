# Media Access & Analytics Project

This is the backend for a media streaming and analytics platform. It's built with Node.js and Express.

## What it does

*   Lets you sign up and log in.
*   You can upload audio and video files.
*   It tracks how many times the files are viewed.
*   It has a few API endpoints to see the analytics.

## How to get it running

First, you need to have Node.js installed on your computer.

1.  **Install the stuff it needs:**
    Open a terminal in the project folder and run:
    ```
    npm install
    ```

2.  **Set up your environment variables:**
    *   Make a copy of the `.env.example` file and rename it to `.env`.
    *   You can leave the default values for now, they should work for local testing.

3.  **Start the server:**
    To get the server running, use this command:
    ```
    node src/app.js
    ```
    You should see a message that says "Server is running on port 3000".

## How to test it

I made a test script that runs through all the main features.

1.  Make sure the server is running in one terminal.
2.  Open a *second* terminal and run:
    ```
    node test.js
    ```
    It will print out a bunch of stuff to show you what it's doing. It should end with "API Tests Completed Successfully".

## API Endpoints

Here are the main API endpoints. You'll need a tool like Postman or Insomnia to use them.

*   `POST /auth/signup` - Create a new user.
*   `POST /auth/login` - Log in and get a token.
*   `POST /media` - Upload a media file (you need to be logged in).
*   `GET /media/:id/stream-url` - Get the URL for a media file.
*   `POST /analytics/media/:id/view` - Log a view for a file.
*   `GET /analytics/media/:id/analytics` - Get analytics for one file.
*   `GET /analytics/dashboard` - Get analytics for all files.

That's pretty much it!
