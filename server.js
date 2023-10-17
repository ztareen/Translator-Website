const http = require('http');
const express = require('express');

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.set("view engine","ejs");
 
const hostname = '127.0.0.1';
const port = 3000;

app.get('/',(req,res) =>{
  //My HTML goes in there?
  // res.send('<h1>Hello world</h1>');
  // res.end('the input')
  // This fills in the template in views/index.ejs with the variables passed to it
  res.render("index", {name: "Zarak", project: "Translator"})
});


app.post('/text', (req, res) => {
  console.log("in post")
  console.log(req.params.)
  res.send("<h1>" + req.body.user_text + "</h1>");
})

//J gives me the link for what to do
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});