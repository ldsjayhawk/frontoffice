const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
res.render('index', {
  title: 'Home',
  loggedin: false,
  accountData: {},
  nav
});
}

baseController.buildDraft = async function(req, res){
  const nav = await utilities.getNav()
res.render('draft/draft', {
  title: 'Draft',
  loggedin: false,
  accountData: {},
  nav
});
}

module.exports = baseController