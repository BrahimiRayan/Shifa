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
      maxAge : 1000*60 *60 * 24,
      httpOnly : true , 
      sameSite : true
}}));

// globale variables
const cin = /^\d{12}$/;

// routes here
//first page
      router.get("/", controlers.showfirstpage);
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
          check('email').isEmail().normalizeEmail().withMessage('Information incorect , svpl saisir des informations corect'),
          check('phone').isMobilePhone().withMessage('Information incorect , svpl saisir des informations corect'),
          check('cin').matches(cin).withMessage('Information incorect , svpl saisir des informations corect'),
          check("name").isAlpha().withMessage("Information incorect , svpl saisir des informations corect"),
          check("fname").isAlpha().withMessage("Information incorect , svpl saisir des informations corect")
      ],controlers.signup);
      router.get("/signup/confirmEmail",controlers.redirectIfIsLogedIn,controlers.ShowConfirmSignUp);
      router.post("/signup/confirmEmail",controlers.redirectIfIsLogedIn,controlers.ConfirmSignUp);
//home route
      router.get("/home",controlers.redirectIfnotLogedIn,controlers.showhome);
/******************************************************patient page ****************************************/
// patient Accueil
      router.get("/patient/accueil",controlers.redirectIfnotLogedIn, controlers.userInterface);

// patient reserver
      router.get("/patient/reserver" ,controlers.redirectIfnotLogedIn, controlers.reserverpatient);
      router.post("/patient/reserver" ,controlers.redirectIfnotLogedIn, controlers.reserverpatientChoixService);
      router.get("/patient/reserver/date" ,controlers.redirectIfnotLogedIn, controlers.showdatereserver);
      router.post("/patient/reserver/date" ,controlers.redirectIfnotLogedIn, controlers.reserverpatientChoixDate);
      router.get("/patient/reserver/time" ,controlers.redirectIfnotLogedIn, controlers.showtimereserver);
      router.post("/patient/reserver/time" ,controlers.redirectIfnotLogedIn, controlers.reserverpatientChoixtime);
      router.get("/patient/reserver/confirm" ,controlers.redirectIfnotLogedIn, controlers.showconfirmreservice);
      router.post("/patient/reserver/confirm" ,controlers.redirectIfnotLogedIn, controlers.reserverpatientConfirm);
    
// patient reservation
      router.get("/patient/myreservations",controlers.redirectIfnotLogedIn, controlers.reservationpatient);
      router.post("/deleterdv/:id" ,controlers.redirectIfnotLogedIn, controlers.deleterdv);
      router.post("/patient/myreservation" ,controlers.redirectIfnotLogedIn, controlers.searchrdv);
      router.post("/patient/myreservation/filter" ,controlers.redirectIfnotLogedIn, controlers.filterbydate);

// patient settings
      router.get("/patient/Settings",controlers.redirectIfnotLogedIn,controlers.parametrepatient);
      router.post("/patient/deleteacount",controlers.redirectIfnotLogedIn , controlers.deleteAccount);
      router.get("/patient/Settings/viewdetails",controlers.redirectIfnotLogedIn , controlers.viewdetailspatient);
      router.get("/patient/Settings/modifyinfop",controlers.redirectIfnotLogedIn ,controlers.modifyinfoP);
      router.post("/patient/Settings/perssonelle",controlers.redirectIfnotLogedIn , controlers.ModifyperssonellInfo);
      router.post("/patient/Settings/addChild",controlers.redirectIfnotLogedIn , controlers.addChild);
      router.post("/patient/Settings/Securite",controlers.redirectIfnotLogedIn , controlers.Securite);
      
      // LOGOUT POST 
      router.post("/logout", controlers.logout)

// / ////////////////////////////////////////////////////////Admin logique  ////////////////////////////////////
// acueill off an : admin
      router.get("/admin/accueil", controlers.redirectIfnotLogedIn ,controlers.ShowAccueilAdmin);
// aficher liste patient       
      router.get("/admin/listpat" , controlers.redirectIfnotLogedIn,controlers.Showlistpatient)

// show liste docteur for : admin
      router.get("/admin/listdocs", controlers.redirectIfnotLogedIn,controlers.Showdocs);
// delete a docteure by : admin     
      router.post("/deldocs", controlers.redirectIfnotLogedIn,controlers.deletedoc);
// inscription of a doctor by : admin
      router.post("/admin/inscriptionDocteur" ,controlers.redirectIfnotLogedIn,controlers.inscriredoc )
// search      
      router.post("/admin/searchdocs" ,controlers.redirectIfnotLogedIn,controlers.searchbar )
      router.post("/admin/snom" ,controlers.redirectIfnotLogedIn,controlers.searchdocbyname )
      router.post("/admin/sservice" ,controlers.redirectIfnotLogedIn,controlers.searchdocbyservice )
      router.post("/admin/smatricule" ,controlers.redirectIfnotLogedIn,controlers.searchdocbymatricule )

// show liste secritaire by : admin
router.get("/admin/listsec", controlers.redirectIfnotLogedIn,controlers.Showsecs);
// delete a docteure by : admin     
router.post("/delsec", controlers.redirectIfnotLogedIn,controlers.deletesec);
// insecription liste secritaire by : admin
router.post("/admin/inscriptionsec" ,controlers.redirectIfnotLogedIn,controlers.inscriresec );
// search  sec & patient by : admin
router.post("/admin/searchsec" ,controlers.redirectIfnotLogedIn,controlers.searchbarS );
router.post("/admin/searchpatient" ,controlers.redirectIfnotLogedIn,controlers.searchbarp );
router.post("/admin/snomS" ,controlers.redirectIfnotLogedIn,controlers.searchsecbyname);
router.post("/admin/snomP" ,controlers.redirectIfnotLogedIn,controlers.searchpatbyname );
router.post("/admin/smatriculeS" ,controlers.redirectIfnotLogedIn,controlers.searchsecbymatricule);
router.post("/admin/smatriculeP" ,controlers.redirectIfnotLogedIn,controlers.searchpatbyemail );
// supperimer patient by : admin
router.post("/admin/deletepatient" ,controlers.redirectIfnotLogedIn,controlers.deletepatient);

// view doc profile ;
router.get("/viewdoc/:id" ,controlers.redirectIfnotLogedIn, controlers.viewdoc);
router.post("/modifydocbyadmin/:id" ,controlers.redirectIfnotLogedIn, controlers.modifydocbyadmin);
// view sec profile
router.get("/viewsec/:id" ,controlers.redirectIfnotLogedIn, controlers.showsec);
router.post("/modifysecbyadmin/:id" ,controlers.redirectIfnotLogedIn, controlers.modifysecbyadmin);
// show services for thw admin
router.get("/admin/services" , controlers.redirectIfnotLogedIn , controlers.ShowservicesByadmin);
router.post("/admin/changeCapHours/:idserv" , controlers.redirectIfnotLogedIn , controlers.changeCapHour);
// parametere pour admin
router.get("/admin/Settings" , controlers.redirectIfnotLogedIn , controlers.Adminsettings);
router.post("/admin/Settings" , controlers.redirectIfnotLogedIn , controlers.ChangeAdminInfo);

// docteur

// acueil medecin
router.get("/doc/accueil", controlers.redirectIfnotLogedIn,controlers.showdocpage);
// reserver medcin
router.get("/doc/reserver", controlers.redirectIfnotLogedIn,controlers.docreservation);
// prender un rdv bloque 
router.post("/doc/reserver", controlers.redirectIfnotLogedIn,controlers.takeBlockedrdv);
// page des patient pour le medcins.
router.get("/doc/patients", controlers.redirectIfnotLogedIn,controlers.showpatienttoDoc);
// page des medcinces 
router.get("/doc/medcins", controlers.redirectIfnotLogedIn,controlers.showColeague);
// settings doc 
router.get("/doc/settings", controlers.redirectIfnotLogedIn,controlers.showSettingsDoc);
// post request doc settings
router.post("/doc/settings", controlers.redirectIfnotLogedIn,controlers.updateUser);
// search docteurs
router.post("/doc/barSearch", controlers.redirectIfnotLogedIn , controlers.searchbarDoctor)
router.post("/doc/nom", controlers.redirectIfnotLogedIn , controlers.searchbynomDoctor)
router.post("/doc/service", controlers.redirectIfnotLogedIn , controlers.searchbyservDoctor)


// SECRITAIRE ...

// ACCUEILL
router.get("/sec/accueil" , controlers.redirectIfnotLogedIn , controlers.showSecritaire);
// RESERVER RDV TEMPORAIRE

router.get("/sec/reserver" , controlers.redirectIfnotLogedIn , controlers.showrdv);
router.post("/reservation/temp" , controlers.redirectIfnotLogedIn , controlers.rdvTemp);

router.get("/sec/patients" , controlers.redirectIfnotLogedIn , controlers.patientShow);
router.post("/sec/searchPatientSec" , controlers.redirectIfnotLogedIn , controlers.searchPatientsByname);


router.get("/sec/medcins" , controlers.redirectIfnotLogedIn , controlers.showMedcinsBySec);
router.post("/sec/barSearch", controlers.redirectIfnotLogedIn , controlers.searchbarSecr);
router.post("/sec/nom", controlers.redirectIfnotLogedIn , controlers.searchbynomSecr);
router.post("/sec/service", controlers.redirectIfnotLogedIn , controlers.searchbyservSecr);

router.get("/sec/settings", controlers.redirectIfnotLogedIn,controlers.showSettingsSec);
router.post("/sec/settings", controlers.redirectIfnotLogedIn,controlers.updateSec);

module.exports = router ;