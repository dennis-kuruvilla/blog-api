const express = require('express')
require('dotenv').config();
require('express-async-errors')
const cors = require('cors')

const middleware = require('./utils/middleware')
const connection = require('./utils/blogDB')
const mailer= require('./utils/mailer')

const app = express()

var blogDB


app.use(express.json())
app.use(cors())

const connectToDB = async() => {
    try{
 blogDB = await connection.dbConnection()
    }
    catch(error){
        console.log("Error connecting to DB, please check username/password. Also check if you are authorized in GCP")
        console.log(error)
    }
}

connectToDB()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)


app.get('/', (req, res) => {
    res.sendFile('index.html',{ root: '.' });
  })

app.post('/posts', async (req,res) => {
    const body = req.body
    const title = body.title
    const description= body.description
    const author= body.author

    if(!title || !description || !author || title.length<1 || description.length<1){
        res.status(400).send({ error: 'Invalid Request' })
    }
    else{
        const post_id = await generatePostID()
        const [rows] = await blogDB.execute(`insert into post values('${post_id}','${title}','${description}','${author}')`);
        res.json(rows)

        //Sending mail to every other authors
        let from = "Node Mailer"
        let subject= "new post"
        let text="An author has added a post"
        const [rows2] = await blogDB.execute(`select author_email from author where author_id!="${author}"`);
        const [rows3] = await blogDB.execute(`select author_name from author where author_id="${author}"`);
        var name = rows3[0].author_name
        let to=rows2.map(row=> row.author_email)
        let html = `<p>${name} has added a new post:</p> <h2>${title}</h2><p>${description}</p>`
        mailer.sendMail(to,subject,text,html)
    }
})

app.get('/posts', async (req, res) => {
    const [rows] = await blogDB.execute('select * from post');
        res.json(rows)
  })


app.get('/posts/:id', async (req, res,next) => {
    const id =req.params.id
    if(id.charAt(0)==="P")
    {
        const [rows] = await blogDB.execute(`select * from post where post_id="${id}"`);
        if (rows.length>0) res.json(rows);
    }
    else if(id.charAt(0)==="A"){
        const [rows] = await blogDB.execute(`select * from post where author="${id}"`);
        if (rows.length>0) res.json(rows);
    }
    if (!res.headersSent) next();
  })


app.put('/posts/:id', async (req,res, next) => {
    const body = req.body
    const title = body.title
    const description= body.description
    const author= body.author
    const post_id =req.params.id

    if(!title || !description || !author || title.length<1 || description.length<1 ){
        res.status(400).send({ error: 'Invalid Request' })
    }
    else{
        const [rows] = await blogDB.execute(`update post set title='${title}',description='${description}',author='${author}' where post_id='${post_id}'`);
        if (rows.affectedRows>0) res.json(rows);
    }
    if (!res.headersSent) next();
})

app.delete('/posts/:id', async (req,res,next) => {
    const post_id =req.params.id
    const [rows] = await blogDB.execute(`delete from post where post_id='${post_id}'`);
    if (rows.affectedRows>0) res.json(rows);
    if (!res.headersSent) next();
})


app.get('/authors', async (request, response) => {
    const [rows] = await blogDB.execute('select * from author');
    response.json(rows)
})

app.post('/authors', async (req,res) => {
    const body = req.body
    const author_name = body.author_name
    const author_email= body.author_email
    const author_id = await generateAuthorID()
    if(!author_name || !author_email || author_name.length<1 || author_email<1 || !validateEmail(author_email)){
        res.status(400).send({ error: 'Invalid Request' })
    }
    else{
        const [rows] = await blogDB.execute(`insert into author values('${author_id}','${author_name}','${author_email}')`);
        res.json(rows)
    } 
})

app.delete('/authors/:id', async (req,res,next) => {
    const author_id =req.params.id
    const [rows] = await blogDB.execute(`delete from author where author_id='${author_id}'`);
    if (rows.affectedRows>0) res.json(rows);
    if (!res.headersSent) next();
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


const generatePostID = async () => {
    const [rows] = await blogDB.execute('select max(post_id) as max from post');
    let new_id= Number(rows[0].max.slice(1,4)) + 1
    let formattedNumber = new_id.toLocaleString('en-US', {
        minimumIntegerDigits: 3,
        useGrouping: false
      })
    new_id= "P"+ formattedNumber
    return new_id
    
}

const generateAuthorID = async () => {
    const [rows] = await blogDB.execute('select max(author_id) as max from author');
    let new_id= Number(rows[0].max.slice(1,4)) + 1
    let formattedNumber = new_id.toLocaleString('en-US', {
        minimumIntegerDigits: 3,
        useGrouping: false
      })
    new_id= "A"+ formattedNumber
    return new_id
    
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }



const PORT = process.env.PORT || 3002 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })