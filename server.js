// Express
const express = require('express');
const app = express();
const session = require('express-session')
const expressLayouts = require("express-ejs-layouts")

//Authentication
// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;

//Database
const mongo = require('./db/connect');

//Other
const dotenv = require('dotenv')
const cors = require('cors')
const errorHandler = require('./utilities/errorHandler');
const swaggerRouter = require('./routes/swagger');
const utilities = require('./utilities')
const baseController = require('./controllers/baseController');
const port = process.env.PORT || 3000;

//----------------
// Middleware
//----------------

    // app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(express.json());

app.use(session({
    secret: 'secret', //random number in production
    resave: false,
    saveUninitialized: true,
}));

// Basic express session initialization
// app.use(passport.initialize());
// app.use(passport.session());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With', 'Content-Type', 'Accept', 'Z-Key'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        next();
    })
    app.use(cors({ methods: ['GET, POST, PUT, DELETE, OPTIONS, PATCH'] }));
    app.use(cors({ origin: '*' }));

// Express Messages Middleware
app.use(require('connect-flash')())


// app.use(cors({
//   origin: ['https://cse341-fgm.onrender.com', 'http://localhost:3000'], 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key'],
//   credentials: true // needed for sessions / passport
// }));

// // Let Express handle OPTIONS requests
// app.options('/*', cors());


//------------------
// PASSPORT 
//------------------

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
// },
// function(accessToken, refreshToken, profile, done) {
//     //User.findOrCreate({ githubId: profile.id }, function (err,user) {
//     console.log(null,profile)
//         return done(null, profile);
//         //});  mongodb user db call for user object
//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user);    
// });
// passport.deserializeUser((user, done) => {
//     done(null, user);    
// });
    

// -------------------------
// View Engine and Templates
// -------------------------

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

//------------------
// ROUTES 
//------------------

// // app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
// app.get('/github', (req, res) => { res.send(req.session.user != undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});


// app.get('/github/callback', 
//     passport.authenticate('github', {failureRedirect: '/api-docs'}), //, session: false}
//     (req, res) => {
//         req.session.user = req.user;
//         res.redirect('/');
//     }
// );

// Index route
app.use(express.static("public"));
app.get("/", utilities.handleErrors(baseController.buildHome))  // how do I handle errors here? adjust utilities line 35 as needed

// Account route
// app.use("/account", accountRoute)

app.use('/', require('./routes'));
app.use(errorHandler);
app.use('/api-docs', swaggerRouter);

mongo.initDb((err) => {
    if(err) {
        console.log(err);
    } 
    else {
        app.listen(port, () => {console.log(`Database is listening and node running on port: ${port}`)})
    }
})