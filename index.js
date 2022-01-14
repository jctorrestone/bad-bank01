var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');
const e = require('express');

// used to serve static files from public directory
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// // create user account
// app.get('/account/create/:name/:email/:password', function (req, res) {

//     // check if account exists
//     dal.find(req.params.email).
//         then((users) => {

//             // if user exists, return error message
//             if(users.length > 0){
//                 console.log('User already in exists');
//                 res.send('User already in exists');    
//             }
//             else{
//                 // else create user
//                 dal.create(req.params.name,req.params.email,req.params.password).
//                     then((user) => {
//                         console.log(user);
//                         res.send(user);            
//                     });            
//             }

//         });
// });

// create user account
app.get('/account/create/:name/:email', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }

        });
});

// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// update - deposit/withdraw amount
app.post('/account/updatePhoto/', function (req, res) {
    const email = req.body.email;
    const url = req.body.newPhoto;
    dal.changePhoto(email, url).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// update - transfer amount
app.get('/account/transfer/:from/:to/:amount', function (req, res) {

    dal.findOne(req.params.to).
    then((user) => {
        // if user doesn't exist, return error message
        if(!user){
            console.log('User does not exist');
            res.status(404).send('User does not exist');
        }
        else{
            // else transfer the money
            var amount = Number(req.params.amount);
    
            dal.transfer(req.params.from, req.params.to, amount).
                then((response) => {
                    console.log(response);
                    res.status(200).send(response);
            });           
        }

    });   
});

// all accounts
app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

var port = 3000;
app.listen(process.env.PORT || port, () => console.log("Server is running..."));