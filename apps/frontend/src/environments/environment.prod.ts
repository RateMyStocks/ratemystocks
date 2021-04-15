// require('dotenv').config();

export const environment = {
  production: true,
  // apiUrl: process.env.URL + '/api',
  // apiUrl: 'http://localhost:4000/api',
  // apiUrl: 'https://ratemystocks.com/api',
  // TODO: Either create an separate environment.dev.ts file for Heroku dev environment, or get dotenv to work with a URL variable.
  apiUrl: 'https://ratemystocks-dev.herokuapp.com/api',
};
