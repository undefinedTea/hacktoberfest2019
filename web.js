var express = require('express')
var application = express()

var basicAuthentication = require('basic-auth')
var authentication = function(request, response, continueResponse) {
  function denyAccess(response) {
    response.set('WWW-Authenticate', 'Basic realm=authenticate')
    return response.sendStatus(401)
  }

  var applicant = basicAuthentication(request)

  if(!applicant) {
    return denyAccess(response)
  }

  if(applicant.name === 'local') {
    if(applicant.pass === process.env.LOCAL_AUTHENTICATION) { return continueResponse() }

    //denyAccess
    return denyAccess(response)
  }
}

application.use('/', authentication, express.static(__dirname))
application.listen(process.env.PORT || 1920)

console.log(`rdy on 127.0.0.1:${process.env.PORT}`)
