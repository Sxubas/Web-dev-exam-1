# Web-dev-exam-1
Web application for Web Development class (Fall 2018)

//Insert descripction//

It is made with React for the frontend and Express.js with MongoDB for the backend. The React project is located in the `./frontend` folder. The final app has been deployed to heroku: http://duozi.herokuapp.com/ for public usage.

## How to run it
To run this project, you need to have npm or yarn installed. In this case, we will detail instructions for npm:


 - Clone the project from the github repository:  
 `git clone https://github.com/Sxubas/Web-dev-exam1.git`  
 `cd duozi-web`  
 
 - Install backend project dependencies and run:  
 `npm install`  
 `node index.js`  
 
 - Install frontend project dependencies and run:  
 `cd ./frontend`  
 `npm install`  
 `npm start`  

Afterwards, both projects will be running. Backend API calls are bibnded to `localhost:8080` and frontend development server is binded to `localhost:3000`. Requesting `localhost:3000` through browser will run the app as it is on heroku (It proxies it's requests to `localhost:8080`).

## Authors
[Julián Manrique](https://github.com/Sxubas)
