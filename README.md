# Trivia Tracker API

Live app: https://trivia-tracker-app-alpha-six.now.sh/

Trivia Tracker client can be found at: https://github.com/Rokio117/trivia-tracker

## Technologies
Trivia Tracker API was created using Node.js, ExpressJs, and postgreSQL


## Login and Register Endpoints

### Register as new user
#### Request
POST /api/auth/register
#### Response
```javascript
{
  username:"",
  id:Number,
  authToken:""
}
```

### Login as returning user
#### Request
POST /api/auth/login
#### Response
```javascript
{
  authToken:"
}
```

## Get user information

### Get all user info
#### Request
GET /api/bookmark/userInfo/:username
#### Response
```javascript
{
  username:"",
  id:Number,
  books:[
          id:Number
          title:"",
          authors:[""],
          coverart:"",
          description:"",
          googleid:""
          ontab:"",
          currentpage:"",
          startedon:"",
          finishedon:"",
          bookid:"",
          notes:[
                  notetitle:"",
                  notedate:"",
                  notecontent:""
                ]
       ]
}
```

## Post user info

### Post user book info
#### Request
POST /api/bookmark/userinfo/:username/books/add
#### Response
```javascript
{
  ontab:"",
  currentpage:"",
  startedon:"",
  finishedon:"",
  userid:"",
  bookid:""
}
```

### Post user note info
#### Request
POST /api/bookmark/:username/notes
#### Response
```javascript
status:200,
{
  "ok"
}
```

## Patch user info

### Patch user book info
#### Request
PATCH /api/bookmark/:username/book/update
#### Response
```javascript
{
  ontab:"",
  currentpage:"",
  startedon:"",
  finishedon:"",
  userid:"",
  bookid:""
}
```

### Patch user book tab
#### Request
PATCH /api/bookmark/book/changeTab
#### Response
```javascript
{
  ontab:"",
  currentpage:"",
  startedon:"",
  finishedon:"",
  userid:"",
  bookid:""
}
```

## Delete user info

### Delete user book info
#### Request
DELETE /api/bookmark/:username/book/delete
#### Response
```javascript
status:204
```

### Delete user note info
#### Request
DELETE /api/bookmark/:username/notes
#### Response
```javascript
status:204
```
























