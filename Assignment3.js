var HTTP_PORT = process.env.PORT || 3000;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://saboor:ahmadi@ds125255.mlab.com:25255/mongoweb322assignment3";

const express = require("express");
const exphbs = require('express-handlebars');
const path = require ("path");
const app = express();
var bodyParser = require('body-parser');
const fs = require("fs");
const session = require("client-sessions")
const randomString = require('randomstring');
var router = express.Router();
var mongodb = require("mongodb");


app.engine(".hbs", exphbs({ extname: ".hbs"}));
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

function passwordCheck()
{
    console.log('Wrong Password')
    return false;
}

function userCheck()
{
    console.log('Wrong Username')
    return false;
}

var strRandom = randomString.generate(); 

app.use(session(
{
        cookieName: "MySession",
        secret: strRandom,      												
        duration: 5 * 60 * 1000,												
        activeDuration: 1 * 60 * 1000,											
        httpOnly: true,                                                         
        secure: true,                                                        
        ephemeral: true       
    }
));

var obj = JSON.parse(fs.readFileSync('./user.json'));

app.get("/", function(req, res)
{
    var values = {
        userName : "",
        password : ""
    } 
    
    res.render('Assignment2Login',{data:values})
})

app.post("/", function(req, res)
{
    userName = req.body.userName,
    password = req.body.password
    
    if(obj.hasOwnProperty(userName) && obj[userName] == password)
    {

        var someData = {
            images: "Cheetah.jpg",
            imageName: "Cheetah"

            }

        req.MySession.userName  = userName
        req.MySession.password = password

        res.render('Assignment', {data:someData})
    }

    else
        if(obj.hasOwnProperty(userName) && obj.userName != password)
        {
            passwordCheck();
            var err = "Wrong Password"
            var mess = {err}
            res.render('Assignment2Login', {data:mess})
        }

    else
    {
        userCheck();
        var err = "Wrong Username"
        var mess = {err};
        res.render('Assignment2Login', {data:mess})
    }
})

app.post("/create", function(req, res)
{   
    var someData ={
    [req.body.userName] : req.body.password};
    var data = fs.readFileSync('./user.json');
    var words = JSON.parse(data);
    var str = JSON.stringify(someData, null, 2);
    

    /*.readFile('./user.json', function (err, data) {
        words.push(someData);
    
        fs.writeFileSync("./user.json",JSON.stringify(words, null, 2), function(err){
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
          });
    })*/

    fs.readFile("./user.json", (err, data) => {  // READ
        if (err) {
            return console.error(err);
        };
    
        var data = JSON.parse(data.toString());
        var user = req.body.userName;
        var pass = req.body.password;
        data[user] = pass; // MODIFY
        var writeData = fs.writeFile("./user.json", JSON.stringify(data, null, 2), (err, result) => {  // WRITE
            if (err) {
                return console.error(err);
            } else {
                console.log(result);
                console.log("Success");
            }
    
        });
    });


    function finished(err){
        console.log('All Goog');
    }
    res.render('AssCreate',
    {data : someData})
})

app.post("/animals", function(req, res)
{   
    var data = req.body.seleSaboorAhmadi

    var someData = {
        images:data + ".jpg", 
        imageName:data}

    res.render('Assignment',
    {data:someData})
})

app.post("/logout", function (req, res)
{
    res.clearCookie("MySession")
    res.render('Assignment2Login', {})
})

app.post("/buy", function(req, res)
{    
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
 
    var cloud = true;
 
    var mongodbHost = '127.0.0.1';
    var mongodbPort = '27017';
 
    var authenticate ='';
//cloud
    if (cloud) {
    mongodbHost = 'ds125255.mlab.com';
    mongodbPort = '25255';
    authenticate = 'aahmadi15:#3j996A27@'
    }
        var mongodbDatabase = 'mongoweb322assignment3';
 
        // connect string for mongodb server running locally, connecting to a database called test
        var url = 'mongodb://'+authenticate+mongodbHost+':'+mongodbPort + '/' + mongodbDatabase;

        MongoClient.connect(url, (err, db) => 
        {
            if (err) throw err;
            
            var someData = { images : data + ".jpg"};
        
            db.collection("galleries").findOneAndUpdate(
                {Filename: someData},
                {$set:
                    {Status:"S"}
                },
                {returnOriginal : false}
            );
            
        
            db.close();
     }); 


         var data = req.body.seleSaboorAhmadi;

         var someData = {
            images: data + ".jpg"};

        res.render("Assignment3Buygallery", {data:someData});
        /*var cursor = db.collection("galleries").find().toArray(function(err, result)
        {
            res.render("Assignment3Buygallery",result[0].F_NAME);
        });*/

    });

app.post("/bought", function (req, res)
{
    MongoClient.connect(url, function(err, db){
        if (err) throw err;
    var data = req.body.seleSaboorAhmadi
    var buy = "SOLD!";
    var mess = {buy};

    var someData = {
        images: data + ".jpg",
        mess
    };

    db.collection("galleries").findOneAndUpdate(
        {Filename: someData},
        {$set:
            {
                Status : "S"
            }
        },
        
        {returnOriginal:false}
    );

    db.close();

    res.render('Assignment3Buygallery', {data:someData});
});
})

app.post("/cancel", function(req, res)
{
    var data = req.body.gallerySele;

    var cancel = "MAYBE NEXT TIME!";
    var mes = {cancel};

    var someData = {
        images: data + ".jpg",
        mes};

    res.render('Assignment3Buygallery', {data:someData});
})

var server = app.listen(HTTP_PORT, function () {
	console.log('Listening on port ' + HTTP_PORT);
});
