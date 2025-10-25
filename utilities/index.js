const Util = {}


//-----------------------------------------
// Builds navigation
//-----------------------------------------

Util.getNav = async function (req, res, next) {

    
//   let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    list += '<li><a href="signup.html">Sign-up</a></li>'
    list += '<li><a href="teams.html">Rosters</a></li>'
    list += '<li><a href="/draft">Draft</a></li>'
    // list += '<li><a href="search.html">Search</a></li>'

//    data.rows.forEach((row) => {
    //  list += "<li>"
    //  list +=

//       '<a href="/inv/type/' +
//       row.classification_id +
//       '" title="See our inventory of ' +
//       row.classification_name +
//       ' vehicles">' +
//       row.classification_name +
    //    "</a>"
    //  list += "</li>"})
   list += "</ul>"
   return list
}
// Do I need this for error handling?
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
// Util.checkJWTToken = (req, res, next) => {
//   res.locals.loggedin = 1

//   if (req.cookies.jwt) {
//   jwt.verify(
//    req.cookies.jwt,
//    process.env.ACCESS_TOKEN_SECRET,
//    function (err, accountData) {
//     if (err) {
//      req.flash("Please log in")
//      res.clearCookie("jwt")
//      return res.redirect("/account/login")
//     }
//     res.locals.accountData = accountData
//     res.locals.loggedin = 1
//     next()
//    })
//  } else {
//   next()
//  }
// }

module.exports = Util