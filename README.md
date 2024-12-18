# node-js-getting-started

A barebones Node.js app using [Express](https://expressjs.com/).

This application supports the tutorials for both the [Cedar and Fir generations](https://devcenter.heroku.com/articles/generations) of the Heroku platform. You can check them out here:

* [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [Getting Started on Heroku Fir with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs-fir)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5006](http://localhost:5006/).

Dados do Hackaton de Frontline 
==========================================

URL: https://hackaton-frontline-web-1-38f75b29c221.herokuapp.com/

Exemplos de Requests: =====================

URL: {BASE_URL}/room?room=SalaDaPaula Method: GET Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

(body is empty)

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [ { "name": "Paula", "point": "3" }, { "name": "Alisson", "point": "34" }, { "name": "UltimoPlayer", "point": "?" }, { "name": "UltimoDosMoicanos", "point": "?" } ] }

====================================================

URL: {BASE_URL}/create-room?room=SalaDaPaula&moderator=Paula Method: POST Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

(body is empty)

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [ { "name": "Paula", "point": "?" } ] }

===================================================================

URL: {BASE_URL}/remove-player?room=SalaDaPaula&player=Paula Method: POST Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

Paula

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [] }

===================================================================

URL: {BASE_URL}/reset-votes?room=SalaDaPaula&player=Paula Method: POST Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

(body is empty)

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [ { "name": "Paula", "point": "?" } ] }

=========================================================================

URL: {BASE_URL}/sendvote?room=SalaDaPaula&player=Paula Method: POST Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

3

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [ { "name": "Paula", "point": "3" } ] }

==========================================================

URL: {BASE_URL}/join-room?room=SalaDaPaula&player=Paula Method: POST Protocol: http/1.1 Status: Complete Response: 200 OK SSL: Yes

---------- Request ----------

(body is empty)

---------- Response ----------

{ "name": "SalaDaPaula", "currentTask": "Task 1", "moderator": "Paula", "players": [ { "name": "Paula", "point": "?" } ] }
