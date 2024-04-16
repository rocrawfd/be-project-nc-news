# Northcoders News API
## Connecting to the Database
In order to connect to the databases, you must create...<br>
```.env.development```<br>
```.env.test```<br>
and input the database names in each file using... <br>
```PGDATABASE=database-name```<br>
You may request the database names to be sent privately.

## Creating the Databases and Seeding Data<br>
Use the scripts in the package.json file to help.<br>
To drop and create the database:  ```npm run setup-dbs```<br>
To seed the dev data: ```npm run seed```<br>

## Endpoints
A list of all available endpoints, and their behaviours, can be found in the endpoints.json file

## Post Requests
### POST api/articles/:article_id/comments:<br>
The input must be an object containing 2 properties. <br> 
1. A key of 'username' with the string value of an existing username from the users table.
2. A key of 'body' with the value of the comment content <br>
e.g. ```{username: "butter_bridge", body: "comment content"}```
