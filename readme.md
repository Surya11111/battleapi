1.  restore data using dump(else you can run dataimport script as well)
2.  star server with npm start command
3.  create user with following api"

http://localhost:3002/api/v1/battleapis/setup/user

body : {
      "name",
      "password",
      "admin": true
    }

4. authenticate with api given below
http://localhost:3002/api/v1/battleapis/authenticate

body : {
      name,
      password
  }

5 . core api(use jwt token with header name x-access-token)
  
  http://localhost:3002/api/v1/battleapis/core/battles
  
  http://localhost:3002/api/v1/battleapis/core/list
  
  http://localhost:3002/api/v1/battleapis/core/count
  
  http://localhost:3002/api/v1/battleapis/core/stats
  
  http://localhost:3002/api/v1/battleapis/core/search
