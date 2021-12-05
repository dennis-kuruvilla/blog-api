const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, request, response, next) => {
    console.log("---------------------------------------------------------------")
    console.log("error:",error)
    if(error.errno===1452) response.status(400).send({ error: `SQL Error`, message: `Author ${request.body.author} is not in Author table, please add the author in Author table first` })
    else if(error.sql){
      return response.status(400).send({ error: `SQL Error`, message: `${error.message}` })
    }
    next(error)//if none of the above errors, the error is forwarded to express error handler using next()
  }
  
  module.exports = {
    unknownEndpoint,
    errorHandler
  }