// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to delete token
router.get("/logout", utilities.deleteToken);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route to process registration
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate));


// Process the account update request
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.processAccountUpdate)
)

// Process the account update request
router.post(
  "/updatePassword",
  regValidate.updatedPasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.processPasswordUpdate)
)

module.exports = router;