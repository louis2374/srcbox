## Requirements

- Docker must be installed and running (for tests only)
- NodeJS
- The required .env file placed in the /backend directory

## To Run

- Go to the root of the directory and run `npm i`
- Once this has finished, run `npm run dev`
- Wait for this to load, it may take around 30 seconds.
- Navigate to localhost:3000 and login.

Demo account credentials (you can also create an account):

- email: bingus@gmail.com
- password: bingus123

## Testing

### Backend

- Requires docker to be running
- Navigate to /backend and run `npm test`
- Once tests are complete, you have to manually close the temporary test server.

### Frontend

- Requires docker to be running
- Install Playwright properly by running `npx playwright install`
- Start the tests by running `npx playwright test`
