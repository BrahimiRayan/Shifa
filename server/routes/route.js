const express = require("express");
const router = express.Router();
const session = require('express-session');
const {check ,validationResult} = require("express-validator")
const controlers = require("../controlers/patientControler.js")

router.use(session({
    name : "myCokies",
    secret: 'secretkey1',
    resave: false,
    saveUninitialized: false,
    cookie : {
      maxAge : 1000*60 *60 * 24,// the coco che3ar will be available for 24 sa3a 
      httpOnly : true , 
      sameSite : true
    }
  }));
// globale variables
const cin = /^\d{12}$/;
// routes here ⏬
//first page

router.get("/",controlers.redirectIfIsLogedIn, controlers.showfirstpage);

//authentification routes

router.get("/auth",controlers.redirectIfIsLogedIn, controlers.showauth);
router.post("/auth/patient",controlers.redirectIfIsLogedIn,controlers.verifyAccountpatient);
router.post("/auth/employe",controlers.redirectIfIsLogedIn, controlers.verifyAccountemploye);
// password forgotten by the patient
router.get("/forgotpswd" , controlers.redirectIfIsLogedIn, controlers.showforgotpage)
router.post("/forgotpswd",controlers.redirectIfIsLogedIn, controlers.SendCode)
router.post("/forgotpswd/config",controlers.redirectIfIsLogedIn, controlers.verifySendCode)
router.post("/forgotpswd/config/changepswd",controlers.UpdatePatientPassword)
// Forgot password by docs >>
router.get("/Dforgotpswd" ,controlers.redirectIfIsLogedIn,  controlers.showforgotpageD)
router.post("/Dforgotpswd",controlers.redirectIfIsLogedIn, controlers.SendCodeD)
router.post("/Dforgotpswd/config",controlers.redirectIfIsLogedIn, controlers.verifySendCodeD)
router.post("/Dforgotpswd/config/changepswd",controlers.redirectIfIsLogedIn, controlers.UpdatePatientPasswordD)
//insecription routes
router.get("/signup",controlers.redirectIfIsLogedIn, controlers.showsignup);
router.post("/signup", [
    check('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    check('phone').isMobilePhone().withMessage('Invalid phone number'),
    check('cin').matches(cin).withMessage('Invalid CIN number'),
    check("name").isAlpha().withMessage("Name should be formed with alphabet"),
    check("fname").isAlpha().withMessage("Family name should be formed with alphabet")
],controlers.signup);
//home route
router.get("/home",controlers.redirectIfnotLogedIn,controlers.showhome);

module.exports = router ; 