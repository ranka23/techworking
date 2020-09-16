# TechWorking - Networking for Techies
A platform for developers to connect and share their skills, expertise and experience. This is a Full Stack MERN (MongoDB, Express, React, Node) project, deployed on Hereko. 

Check it out here -> https://techworking.herokuapp.com/

### Features of the Application

  - Authenticate with email.
  - Create a developer profile after registering.
  - View other developers' profiles on the social network.
  - Update experience and education details to profile.
  - Showcase repo and other information from your Github accout.
  - Add links to your social media pages and/or profile.
  - Create Posts for other developers to read and interact.
  - Edit your posts.
  - View other developers' posts and interact with them.
  - Like Posts.
  - Comment on Posts.
  - Access all vital routes from the Dashboard.
  - Delete your posts, comments or profile.

### Server stack
  - Node.js / Express.js
  - MongoDB (Database)
  - RestAPI
  - JSON Web Tokens
  - Passport
  - Mongoose
  - Validator (Server side validation for all inputs)

### Client stack
  - React.js
  - Bootstrap
  - Redux / React-Redux / Redux-Thunk
  - Axios(for calls to API)
  - React Router / React Router DOM
  - JWT Decode
  - Moment.js

### Usage

```sh
$ clone the repo
$ run 'yarn' to install node modules for server.
$ cd into 'web'.
$ run 'yarn' to install node modules for web.
$ cd back into root folder.
$ run 'yarn dev' to concurrently start the server and the application.
$ run 'yarn dev' for development environment

```

For development environment.

```sh
$ Server on port 5000. Client on port 3000
```

### Package.json Scripts

| Scripts | README |
| ------ | ------ |
| client-install:  | cd web && yarn |
| start | node server.js |
| server | nodemon server.js |
| client | cd web && yarn start |
| dev | concurrently \"yarn server\" \"yarn client\" |
| heroku-postbuild | NPM_CONFIG_PRODUCTION=false cd web && yarn && yarn build |

NOTE: You need to include your own OAuth Key and Secret from Github (developer settings) and add them to web/src/components/profile/ProfileGithub.js to enable the app to make calls to Github's api. Better yet, remove those env variables from the file and add them to a protected file to be safe.

License
----
MIT
