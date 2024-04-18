# Northcoders News API

## Introduction
This is a backend api project containing a database of 4 linked tables. Users can write news **articles** about several **topics** and can leave **comments** underneath.<br>
The hosted version can be found online here: <br>
https://northcoders-news-app-ei5k.onrender.com/<br>
A list of all available endpoints, and their behaviours, can be found in the endpoints.json file

## Setting Up
1. Clone the repository by typing ```git clone https://github.com/rocrawfd/project-nc-news``` into your terminal. It will now be accessible on your local device.

2. Open the repo and install the dependencies using ```npm install```.

3. Use the scripts in the package.json file to help.<br>
To drop and create the database:  ```npm run setup-dbs```<br>
To seed the dev data: ```npm run seed```<br>

4. To run the tests, in the __tests__ folder, use ```npm test```.

5. In order to connect to the databases, you must create...<br>
```.env.development```<br>
```.env.test```<br>
and input the database names in each file using... <br>
```PGDATABASE=database-name```<br>
You may request the database names to be sent privately.


## Node & Postgres
Minimum versions: <br>
Node.js: **v21.6.1**<br>
Postgres: **15.6**
