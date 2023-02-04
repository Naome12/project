const path=require('path');
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const app=express();
const mysql = require('mysql');
const PORT = 8000;
const multer = require("multer");
const { diskStorage } = require("multer");

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Tuyishime',
  password: 'tuyishimenaomerca',
  database: 'sign'
});
connection.connect((err) => {
  if (err) console.log("error found," + err);
  console.log(connection.state);
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, " ")));

app.set("view engine", "ejs");

app.get('/', (req,res)=>{
    res.render("signup.ejs");   
})
app.post('/register',upload.single('profile_pic'),(req,res,next)=>{
 

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let pwd = req.body.pwd
    let user_name= req.body.user_name
    let image=req.body.photo;

connection.query(`INSERT INTO signup (FirstName,LastName,Email,Password,UserName,image) VALUES (?,?,?,?,?,?)`,[first_name,last_name,email,pwd,user_name,image],(err,result)=>{
        if(err) console.log('error found:',err);
        console.log(result);
        console.log(req.body);
    
})
connection.query(
  `SELECT * FROM signup WHERE email = ?`,
  [email],
  async (err, result) => {
    if (err) console.log("err found:", err);
    console.log(result);
  
    let id = result[0].id

    image = path.join("images", "uploads", result[0].image.toString());

    console.log(image);
    res.render("dashboard.ejs", { pwd,email,id, image });
    res.end();
  }
);
  })
  

  app.get('/login1',(req,res)=>{
    res.render('form')
});
app.post('/login',(req,res)=>{
console.log(req.body);
let email = req.body.email;
let pwd = req.body.password

let image;

connection.query(
  `SELECT * FROM signup WHERE FirstName = ? AND Password=?`,
  [first_name,pwd],
  async (err, result) => {
    if (err) console.log("err found:", err);

console.log(result);
  
let id = result[0].id;
let first_name = result[0].first_name
let last_name=result[0].last_name
console.log('the id is,'+ id);

if (result==""){
  return res.status(402).render('login');
  
}
else{
  let email=result[0].email;
  let image=path.join("images","uploads",result[0].images.toString());
  res.render('dash',{first_name,last_name,pwd,email,user_name,image,id});
}
});
});
app.post('/update/:id', (req, res) => {
  let id=req.params.id
  console.log(id);

  console.log(req.body);
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let pwd = req.body.pwd;
  let user_name = req.body.user_name;
  let image=req.body.image;
  
 connection.query(
  `UPDATE  signup SET password = ?,Confirm =?,email=? WHERE id = ?`,
  [pwd,user_name, email,id],
  (err, result) => {
  if (err) console.log("error found:", err);
  
  req.url = ``
  res.redirect(`http://localhost:${PORT}/login1`)
})
})
app.get('/delete_acc/:id', (req, res) => {

  let id = req.params.id
  let sql = `DELETE FROM signup WHERE id = ?`
  connection.query(sql, [id], (err, result) => {
    if (err) console.log(err);
    res.redirect('/')
  })
}) 

app.listen(PORT,()=>{
console.log(`server running on port ${PORT}`);
})
