
var dotenv = require('dotenv');
require('dotenv').config();
dotenv.load();
var fromNumber = "+18337456476";
const accountSid = 'AC6941bae142882c5cc278286553a207ed';
const authToken = '6c23a3111c74ecc6ed787c99e5b24571';
const client = require('twilio')(accountSid, authToken);
const path = require("path");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var cookieParser = require('cookie-parser');
var session = require('client-sessions');
const connection = require('./database');
var router = express.Router();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/views", express.static(path.join(__dirname, "views")));
var session1 = require('./session');
app.use(session(session1));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// app.route('/user_names/:userId')
//   .get(function(req, res, next) {
//     connection.query(
//       "SELECT * FROM `user_names` WHERE id = ? LIMIT 3", req.params.userId,
//       function(error, results, fields) {
//         if (error) throw error;
//         res.json(results);
//       }
//     );
//   });

// app.get('/status', (req, res) => res.send('Working!'));

app.get('/', function(req, res, next){
  res.render('index.ejs');
});

app.get('/login', function(req, res, next){
  res.render('index.ejs');
});

app.post('/login', function(req, res, next){
  connection.query("select count(email) as totalEmails from User where email = \'" + req.body.email.toString() + "\' and passcode = \'" + 
    req.body.passcode.toString() + "\';",
    function(error, results, fields){
      if(error) throw error;
      let countEmails = results[0].totalEmails;
      console.log(countEmails);
      if(countEmails == 0){
        res.redirect('/login');
      }
      else{
        console.log("here");
        req.session.user ={email: req.body.email.toString()};
        req.user = {email: req.body.email.toString()};
        res.redirect('/userProfile');
      }
    }
  );
});

app.post('/logout', function(req, res){
  req.session.reset();
  req.user = null;
  res.redirect('/');
});

app.get('/userProfile', function(req,res, next){
  var resultDriver, resultPassenger, resultVehicle;
  let driverQuery = "Select * from DriverRoute where userEmail = \'" + req.session.user.email + "\';";
  let riderQuery = "select * from PassengerRoute where email = \'" + req.session.user.email + "\';";
  let vehicleQuery = "select * from vehicle where email = \'" + req.session.user.email + "\';";
  connection.query(driverQuery,
    function(error, results, fields){
      if(error) throw error;
      resultDriver = JSON.parse(JSON.stringify(results));
      connection.query(riderQuery,
        function(err, result, fie){
          if(err) throw err;
          resultPassenger = JSON.parse(JSON.stringify(result));
          connection.query(vehicleQuery,
            function(error, result, fields){
              if(error) throw error;
              resultVehicle = JSON.parse(JSON.stringify(result));
              res.render("profile.ejs", {"passenger" : resultPassenger, "driver" : resultDriver, 'vehicle' : resultVehicle});  
            })
          
        });
    });


});

app.get('/registration', function(req, res, next){
  res.render('registration.html');
});

app.post('/registration', function(req, res, next){
  console.log(req.body);
  let userPhoneNumber = req.body.phoneNumber.toString().replace(/-/g, "");
  let parsedPhoneNumber = "+1" + userPhoneNumber;
  let userEmail = req.body.email.toString();
  let userFirstName = req.body.firstName.toString();
  let userLastName = req.body.lastName.toString();
  let userPasscode = req.body.passcode.toString();
  let sqlQuerry = "insert into User (email, firstName, lastName, phoneNumber, passcode) values (\'" + userEmail + "\', \'" + userFirstName
  + "\', \'" + userLastName + "\', \'" + parsedPhoneNumber + "\', \'" + userPasscode + "\');";
  connection.query(sqlQuerry,
     function(error, results, fields){
       if(error) throw error;
       console.log(results[0]);
       req.session.user = req.body;
       req.user = req.body;
       console.log(req.session.user);
       res.redirect('/userProfile');
     });
});


app.get('/user/rides', function(req, res, next){
  //also displays profile screen
    var result1, result2;
    connection.query(
      "SELECT * FROM DriverRoute WHERE userEmail = \'" + req.body.email.toString() + "\';",
      //"SELECT * FROM DriverRoute WHERE userEmail = \'bob@me.com\';",
      function(error, results, fields){
        if (error) throw error;
        //console.log("results", results);
        result1 = JSON.parse(JSON.stringify(results));
        //console.log(result1);
        connection.query(
          "SELECT * FROM PassengerRoute WHERE email = \'heck@heck.heck\';",
          function(error, results, fields){
            //console.log(result1);
            if (error) throw error;
            result2 = JSON.parse(JSON.stringify(results));
            console.log(result2[0].id);
            res.render("profile.ejs", {"passenger": result1, "driver":result2});
          }
        );
      
      
      
      }
    );
    //console.log(result1, result2);
    //res.render("matches.ejs", {"passenger": result1, "driver":result2});
});

app.get('/user/vehicle', function(req,res,next){
  res.render("vehicle.html");
})

app.post('/user/vehicle', function(req, res, next){
  connection.query(
     "INSERT INTO vehicle ( email, make, model, manufactureYear, color, numSeats) VALUES (\'" + 
     req.session.user.email + "\', \'" + req.body.make.toString() + "\', \'" + req.body.model.toString() + "\', \'" + req.body.year  +
     "\', \'" + req.body.color.toString() + "\', \'" + req.body.numSeats.toString() + "\');",
    //"INSERT INTO vehicle (email, make, model, manufactureYear, color, numSeats) VALUES ('bob@me.com', 'Porsche', 'Cammera', 2008, 'Yellow', 3);" ,
    function(error, results, fields){
      if (error) throw error;
      res.redirect('/userProfile');
      //res routes thingdo theres's that
    }
  )
});

app.get('/user/driver', function(req,res,next){
  var vehicleList;
  let vehicleQuery = "select * from vehicle where email = \'" + req.session.user.email + "\';";
  console.log(vehicleQuery);
  connection.query(vehicleQuery,
    function(error, results, fields){
      if (error) throw error;
      vehicleList = JSON.parse(JSON.stringify(results));
      console.log("vehicle", vehicleList);
      res.render("driver_details.ejs", {vehicles : vehicleList});
    });
});

app.post('/user/driver', function(req,res,next){
  let pushQuery = "insert into DriverRoute (userEmail, startLoc, endLoc, tripDate) values (\'" + req.session.user.email + 
    "\', \'" + req.body.startingAddress.toString() + "\', \'" + req.body.destinationAddress.toString() + "\', \'" + 
    req.body.date + "\');";
  connection.query(pushQuery,
    function(error, results, fields){
      if(error) throw error;
      res.redirect('/userProfile');
    });
});

app.get('/routes', function(req, res, next){
  //display page for adding routes
});

app.get('/user/rider', function(req, res,next){
  res.render("passenger_details.html");
});



app.post('/routes/matches', function(req, res, next){
      //if(req.body.isDriver){
      var parsedResults;
      if(req.body.isDriver){ 
        connection.query(
           "SELECT * FROM DriverRoute WHERE endLoc = \' " + 
           req.body.endLoc.toString() + "\' AND date = \'" + req.body.date + "\';",
          //"SELECT * FROM DriverRoute WHERE startLoc = 'Pasadena' and endLoc = 'Irvine', and tripDate = '2018-09-18';",
          function(error, results, fields){
            if (error) throw error;
            parsedResults = JSON.parse(JSON.stringify(results));
            console.log("hi driver");
            console.log(parsedResults);
            res.render("matches.ejs", {"results": parsedResults});
          }
        );
      }
      console.log(req.body);
      let passengerQuery = "SELECT * FROM PassengerRoute WHERE  endLoc = \'" + req.body.destinationAddress.toString() + "\' AND tripDate = \'" + req.body.Date + "\';";
      console.log(passengerQuery);
      connection.query(passengerQuery,
        //"SELECT * FROM PassengerRoute WHERE startLoc = 'Pasadena' and endLoc = 'Irvine' and tripDate = '2018-09-19';",
        function(error, results, fields){
          if (error) throw error;
          parsedResults = JSON.parse(JSON.stringify(results));
          console.log("hi passenger");
          console.log(parsedResults);
          res.render("matches.ejs", {"results": parsedResults});
        }
      );
});

app.post('/routes/connect', function(req, res, next){
  connection.query(
     "INSERT INTO RouteConnection (driverRouteID, PassengerRouteID) VALUES (\'" + req.body.driverId + "\', \'" + req.body.userId + "\';",
    //"INSERT INTO RouteConnection (driverRouteID, PassengerRouteID) VALUES (1,4)",
    function(error, results, fields){
      if (error) throw error;
      res.redirect('/userProfile')
    }
  )
});

app.post('/routes/driver', function(req, res, next){
  connection.query(
     "INSERT INTO DriverRoute (userEmail, startLoc, endLoc, tripDate, vehicleID) VALUES (\'" + req.body.email + "\', \'" + 
     req.body.startLoc.toString() + "\', \'" + req.body.endLoc.toString() + "\', \'" + req.body.date + "\', \'" + req.body.vehicleId + "\');",
    //"INSERT INTO DriverRoute (userEmail, startLoc, endLoc, tripDate, vehicleID) VALUES ('oof@oof.com', 'San Diego', 'San Francisco', '2019-02-18', 1);",
    function(error, results, fields){
      if (error) throw error;
      res.redirect('/routes/matches', {isDriver: true, startLoc: res.body.startLoc.toString(), endLoc: res.body.endLoc/toString(), date: req.body.date})
    }
  )
});

app.post('/routes/passenger', function(req, res, next){
  connection.query(
     "INSERT INTO PassengerRoute (email, startLoc, endLoc, tripDate) VALUES (\'" + req.body.email + "\', \'" + 
     req.body.startLoc.toString() + "\', \'" + req.body.endLoc.toString() + "\', \'" + req.body.date + "\');",
    //"INSERT INTO PassengerRoute (email, startLoc, endLoc, tripDate) VALUES ('lmao@fade.em', 'Minneapolis', 'Toronto', '2019-08-17');",
    function(error, results, fields){
      if (error) throw error;
      res.redirect('/routes/matches', {isDriver: false, startLoc: res.body.startLoc.toString(), endLoc: res.body.endLoc/toString(), date: req.body.date})
    }
  )
});

app.post('/routes/routes/match', function(req,res,next){
  console.log("in routes/routes/match");
  console.log(req.body);
  let passengerRouteID = req.body.trip;
  var driver;
  let phoneNumberQuery = "select * from User where email = (select email from PassengerRoute where id = " + passengerRouteID + ");";
  console.log(phoneNumberQuery);
  connection.query(phoneNumberQuery,
    function(error, results, fields){
      if(error) throw error;
      console.log("inside results");
      console.log(results);
      driver = results[0];
      res.redirect("/userProfile");
      setTimeout(sendDriverMessage, 5000, fromNumber, "+17144960804", driver);
      let addConfirmationQuery = "insert into confirmations (driverEmail, riderEmail, confirmed) values (\'+17144960804\' , \'+15104684408\', 0);";
      connection.query(addConfirmationQuery,
        function(error, results, fields){
          if(error) throw error;
        });
      // setTimeout(sendRiderMessage, 1000, fromNumber, "+15104684408", )
    });
});

function sendDriverMessage(from, to, driver, passangerRouteID){
  console.log(driver);
  let message = driver.firstName.toString() + " " + driver.lastName.toString() + 
    " (" + driver.phoneNumber.toString() + ") has asked to join your ride! Press 'n' to confirm!";
  client.messages.create({
    body: message,
    from: from,
    to: to
  }).then(message=>console.log(message.sid)).done();
  let lastSIDRequestQuery = "select count(driverPhoneNumber) as totalDriverNumber from lastSID";
  connection.query(lastSIDRequestQuery,
    function(error, results, fields){
      let numDriverNumber = results[0].totalDriverNumber;
      if(numDriverNumber == 0){
        let insertNewNumber = "insert into lastSID (driverPhoneNumber, lastRequestSID) values (\'" + driver.phoneNumber.toString() + "\', \'" + message.sid.toString() + "\');";
        connection.query(insertNewNumber,
          function(error, result, fields){
            if(error) throw error;
          });
      }
      else{
        let updateSIDQuery = "update lastSID set lastRequestSID = \'" + message.sid.toString() + "\' where driverPhoneNumber = \'" + driver.phoneNumber.toString() + "\';";
        connection.query(updateSIDQuery,
          function(error, results, fields){
            if(error) throw error;
          });
      }
    });
}

function sendRiderMessage(from, to, message){
  console.log(message);
  client.messages.create({
    body: message,
    from: from,
    to: to
  }).then(message=>console.log(message.sid)).done();
}

app.post('/sms', (req, res)=>{
  const twiml = new MessagingResponse();
  twiml.message("Thank you for your confirmation!");
  res.writeHead(200, {'Content-Type' : 'text/xml'});
  res.end(twiml.toString());
  let fNum = req.body.From;
  var lastSID;
  let inc_message = req.body.Body.toLowerCase().trim();
  console.log(req.body.From);
  console.log(inc_message);
  let updateConfirmationQuery = "";
  if(inc_message  == 'y'){
    updateConfirmationQuery = "update confirmations set confirmed = 1 where driverEmail = \'" + fNum.toString() + "\' and confirmed = 0;";
    let riderMessage = "Your ride has been accepted! Have fun!"
    sendRiderMessage(fromNumber, "+15104684408", riderMessage);
    connection.query(updateConfirmationQuery,
      function(error, result, fields){
        if(error) throw error;
        let getLastSIDQuery = "select lastRequestSID as lSID from lastSID where driverPhoneNumber = \'" + fNum.toString() + "\';";
        connection.query(getLastSIDQuery,
          function(error, results, fields){
            lastSID = results[0].lSID;
            let lastMessage = client.messges(lastSID).fetch().done();
            var importantInfo = lastMessage.split(" - ")[1];
            var splitWords = importantInfo.split(" ");
            let insertIntoPassengerTable = "insert into PassangerRoute (email, startLoc, endLoc, tripDate) values('bob', 'Des Moines', 'Seattle', '2018-07-04')"; 

          }) 
      });
  }
});



// Port 8080 for Google App Engine
// app.set('port', process.env.PORT || 80);
app.listen(80, function(){
  console.log("running on port 80");
});