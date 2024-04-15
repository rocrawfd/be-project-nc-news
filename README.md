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


