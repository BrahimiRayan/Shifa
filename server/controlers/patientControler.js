/************************************************************************************************* */
const mysql = require("mysql2");
const bcrypt =require("bcrypt");
const {check ,validationResult} = require("express-validator")
require("dotenv").config()
const session = require('express-session');
/************************************************************************************************* */
let pool = mysql.createPool({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PSWD,
    database : process.env.DB
}).promise();
/************************************************************************************************* */
//Global variables
let msg = null ;
let Isresereved = null;
let errArray =[];
let emailNotfound = null;
let SearchkeywordServices = "";
let orderFilterdates = "DESC";

let cheackedNewst = "cheacked";
let cheackedOldest = "";
/************************************************************************************************* */
//explicite middlewars : 
    // 1-MIIDELEWARE TO PREVENT THE USER FROM ACCESSING THE HOME PAGE WITHOUT LOGIN
exports.redirectIfnotLogedIn = function (req, res, next){
    if(!req.session.IsAuthId){
        res.redirect("/auth")
    }else{
        next();
    }
}
    // 2-MIDLEWARE TO PREVENT THE USER FROM GOING TO INCREPTION OR LOGIN IF HE ALREADY LOGED UNTIL HE LOGS OUT
exports.redirectIfIsLogedIn = function (req, res, next){
    if(req.session.IsAuthId){
        res.redirect("/patient/accueil");
    }else{
        next ();
    }
}

/******************************************GLOBAL FUNCTIONS******************************************************* */
// Logout
    exports.logout = function (req , res){
        delete req.session.IsAuthId;
        return res.redirect("/");
    }

// delete account
    exports.deleteAccount = async function(req ,res){
        try{
            await pool.query("delete from patients where idp = ?", [req.session.IsAuthId])
            delete req.session.IsAuthId;
            return res.redirect("/");
        }catch(err){
            console.log(err);
        }

        
        
    }
const crypto = require('crypto');

function generateRandomNumber() {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const eightDigitNumber = randomNumber % 100000000;

    return eightDigitNumber.toString().padStart(8, '0');
}

/************************************************************************************************* */

// EMAIL SENDER 
const emailSender = require("../controlers/emailsender.js");
const { userInfo } = require("os");
const { log } = require("console");

/************************************************************************************************* */
// image uploading 



/***********************************************logic************************************************** */

/*********************************************ATHENTIFICATION LOGIC**************************************************** */
//HOME PAGE
exports.showfirstpage = function (req, res){
    res.render('firstpage');
}
/************************************************************************************************* */
// TODO : THE HOME PAGE BASED OF THE USER 
exports.showhome = function (req, res){
    res.send("home");
}
/************************************************************************************************* */
// EMPLOYE ET PATIENT GET REQUEST POUR AUTHENTIFICATION
exports.showauth = function (req, res){
    res.render('athentification', {alert : msg});
    msg = null;
}
/************************************************************************************************* */
// PATIENT POST REQUEST AUTHENTIFICATION
exports.verifyAccountpatient = async function (req, res) {
    try {
        //TODO: crypter le paswd => DONE
        const { email, password_patient } = req.body;
        const [users] = await pool.query("SELECT * FROM patients;");

        if (!email || email === "" || !password_patient || password_patient === "") {
            return res.redirect("/auth");
        } else {
            const compte = users.find(user => user.email.toUpperCase() === email.toUpperCase());
            if (!compte) {
                msg = " ❌ EMAIL EST INCORRECT !";
                res.redirect("/auth");
                return;
            } else {
                try {
                    const samePsword = await bcrypt.compare(password_patient, compte.pswd);
                    if (samePsword) {

                        req.session.IsAuthId = compte.idp;
                        return res.redirect(`/patient/accueil`); //GO TO HOME PAGE 
                    } else {
                        msg = " ❌ MOT DE PASSE EST INCORRECT !";
                        res.redirect("/auth");
                        return;
                    }
                } catch (error) {
                    console.error('Error comparing passwords:', error);
                    res.status(500).send('Error comparing passwords');
                    return;
                }
            }
        }
    } catch (error) {
        console.error('Error executing query to fetch users:', error);
        res.status(500).send('Error executing query to fetch users');
        return;
    }
}
/************************************************************************************************* */
// EMPLOYEE POST REQUEST ATHENTIFICATION
exports.verifyAccountemploye = async function (req , res){
    /*TODO: crypter le paswd  => (UNTIL ADMIN FUNCTIONALITIES ADDED)*/
    const {matricule ,password_employe} = req.body;
    const [users] = await pool.query("SELECT * FROM docteurs;");
    console.log("doc")
    if(!matricule || matricule === "" || !password_employe ||password_employe === ""){
        return res.redirect("/auth");
    }else{
        const compte = users.find(user => user.matricule === matricule);
        if(!compte){
            const [secritaire] = await pool.query("Select * from secritaires;");
            const compteS = secritaire.find(user => user.matricule === matricule);
            if(!compteS){
                const [admin] = await pool.query("Select * from admin;");
                const compteA = admin.find(user => user.matricule === matricule);
                console.log("secritaire");
                if(!compteA){
                   msg = " ❌ Matricule n'existe pas ! ";
                   return res.redirect("/auth"); 
                }else{
                    const samePswordA = await bcrypt.compare(password_employe,compteA.pswd)
                    if(samePswordA){
                        req.session.IsAuthId = compteA.idadmin;
                    //    return res.redirect("/admin/accueil");
                       return res.redirect("/admin/accueil");
                    }else{
                        msg = " ❌ MOT DE PASSE INCORRECT ! ";
                        return res.redirect("/auth");
                    }
                }  
            }else{
                const samePswordS = await bcrypt.compare(password_employe,compteS.pswd)
                if(samePswordS){
                    req.session.IsAuthId = compteS.idsec;
                   return res.redirect("/sec/accueil");
                }else{
                    msg = " ❌ MOT DE PASSE INCORRECT ! ";
                    return res.redirect("/auth");
                }
            } 
        }else{
            const samePsword = await bcrypt.compare(password_employe,compte.pswd)
            if(samePsword){
                req.session.IsAuthId = compte.iddoc;
               return res.redirect("/doc/accueil");
            }else{
                msg = " ❌ MOT DE PASSE INCORRECT ! ";
                return res.redirect("/auth");
            }
        }
    }
}
// je suis la **********==> COMPTE MEDCIN

exports.showdocpage = async function (req ,res){
// get the doctor
    var [doc] = await pool.query(`
        SELECT * FROM docteurs 
        WHERE iddoc = ?;
    `,[req.session.IsAuthId]);
// service de doc 
    var [service] = await pool.query(`
    SELECT nomserv FROM services AS s
    JOIN docteurs AS d ON d.idserv = s.idserv
    WHERE iddoc = ?;
    `,[req.session.IsAuthId]);
// get the number of today reservations in the service

    var [nbrptot] = await pool.query(`
        SELECT COUNT(*) as nbr FROM patients as p
        JOIN rdv as r ON p.idp = r.idp
        WHERE r.iddoc = ? and r.date_rdv < CURRENT_DATE();
    `,[req.session.IsAuthId]);

// nombre de patient pour le prochaine 15 jour
    
    var [nbrp15d] = await pool.query(`
    SELECT COUNT(*) as nbr FROM patients as p
    JOIN rdv as r ON p.idp = r.idp
    WHERE r.iddoc = ? and r.date_rdv >= CURRENT_DATE()
`,[req.session.IsAuthId]);

// nombre de patient of todays
    var date = new Date();
    var today = `${date.getFullYear}-${date.getMonth + 1}-${date.getDay}`;

    var [nbrpToday] = await pool.query(`
    SELECT COUNT(*) as nbr FROM patients as p
    JOIN rdv as r ON p.idp = r.idp
    WHERE r.iddoc = ? and r.date_rdv = ?
`,[req.session.IsAuthId , today]);

// get four today patient for the doctor --GET THE PATIENT THEN LOOP FOR 4 OF THEM
    // ADULTE
    var [todaypatients4] = await pool.query(`
        SELECT DISTINCT P.* FROM patients AS P
        JOIN rdv AS R ON P.idp = R.idp
        WHERE R.iddoc = ? and R.idenf IS NULL 
    `,[req.session.IsAuthId]);
// got the childeren
    var [childeren] = await pool.query(`
        SELECT DISTINCT E.* FROM enfants AS E
        JOIN rdv AS R ON E.idenf = R.idenf
        WHERE R.iddoc = ?;
    `,[req.session.IsAuthId]);

    return res.render("docteur/accueil",{doc , nbrp15d , nbrpToday , nbrptot, todaypatients4 , childeren ,service});
}
exports.docreservation = async function(req , res ){
    try {
     
    // get the doc
    var [doc] = await pool.query("SELECT * FROM docteurs where iddoc = ?;",[req.session.IsAuthId]); 
    // get the service of the doc
        var [service] = await pool.query(`
            SELECT s.nomserv from services AS s
            JOIN docteurs AS d ON s.idserv = d.idserv
            WHERE d.iddoc = ?;
        `, [req.session.IsAuthId]);
    // get the patients that are passed befor
        var [normalPassedPatients] = await pool.query(`
            SELECT DISTINCT P.* FROM patients AS P
            JOIN rdv AS R ON P.idp = R.idp
            WHERE R.iddoc = ?  
        `,[req.session.IsAuthId]);
    // get the childeren that passed befor
        var [childeren] = await pool.query(`
            SELECT DISTINCT C.* ,P.idp from enfants AS C
            JOIN rdv AS R ON C.idenf = R.idenf
            JOIN patients AS P ON C.idp = P.idp
            WHERE R.iddoc = ?;
        `,[req.session.IsAuthId]);
    // get the temp patient that are passed befor too
        var [patienttemp] = await pool.query(`
            SELECT DISTINCT t.* FROM patients_temp as t
            join rdv as r on r.idtemp = t.idtemp
            where r.iddoc = ?;
        `, [req.session.IsAuthId]);

         return res.render("docteur/reserver",{doc , service , normalPassedPatients , childeren , patienttemp});   
    } catch (error) {
        return res.send("opss ,a probleme has occured !");
    }
}
// prendere un redez vous bloque.
exports.takeBlockedrdv = async function(req , res){
    var {patient , temp , enfant ,time , date } = req.body;
    const uuid = crypto.randomUUID();
    const id = uuid.substring(0, 5);

    if(!time || !date || time === "" || date ==="" ||
        !patient ){
        return res.redirect("/doc/reserver");
    }

    if((!enfant || enfant === "") && (!temp || temp === "")){
    
            await pool.query(
                `
                    INSERT INTO 
                    rdv(idrdv, idp, iddoc,type ,date_rdv,heur_debut_rdv)
                    VALUES(?,?,?,?,?,?);
                `,[id , patient[0] , req.session.IsAuthId ,1 , date , time])
                console.log(id , patient[0] , req.session.IsAuthId ,1 , date , time)
            return res.redirect("/doc/accueil");
        
    }else if(enfant !== "" && (!temp || temp === "")){
        try {
            await pool.query(
                `
                    INSERT INTO 
                    rdv(idrdv, idp, iddoc, date_rdv,type, heur_debut_rdv , idenf)
                    VALUES(?,?,?,?,?,?,?);
                `,[id , enfant , req.session.IsAuthId , date ,1, time , patient[0]])
            return res.redirect("/doc/accueil");
        } catch (error) {
            return res.send("...") 
        }

    }else if ((!enfant || enfant ==="") && (temp === "temp")){
        try {
            await pool.query(
                `
                    INSERT INTO 
                    rdv(idrdv, iddoc,idtemp,type ,date_rdv, heur_debut_rdv)
                    VALUES(?,?,?,?,?,?);
                `,[id ,req.session.IsAuthId,patient[0], 1,date , time])
            return res.redirect("/doc/accueil");
        } catch (error) {
            return res.send("...") 
        }
    }
}

exports.showpatienttoDoc = async function (req , res){

    var [doc] = await pool.query(`
        SELECT * FROM docteurs where iddoc = ? 
    `, [req.session.IsAuthId]);

    var [patient] = await pool.query(`
        SELECT DISTINCT patients.* FROM patients
        JOIN rdv ON patients.idp = rdv.idp
        WHERE rdv.iddoc = ?
    `,[req.session.IsAuthId]);

    return res.render("docteur/patient",{patient , doc});
}

var satatment = "d.nom LIKE"; 
var conditioner = "'%'";


exports.searchbarDoctor = async function(req ,res){
    var term = req.body.term
    conditioner = `"%${term}%"`
    return res.redirect("/doc/medcins")
}

exports.searchbynomDoctor = async function(req ,res){
    satatment = "d.nom LIKE";
    return res.redirect("/doc/medcins")
}

exports.searchbyservDoctor = async function(req ,res){
     satatment = "nomserv LIKE";
    return res.redirect("/doc/medcins")
}

exports.showColeague = async function (req , res){
    var [doc] = await pool.query(`
        SELECT * FROM docteurs where iddoc = ?
    `, [req.session.IsAuthId]);

    // get all the docs

    var [docs] = await pool.query(`
    SELECT d.*, nomserv FROM docteurs AS d
    JOIN services AS s ON d.idserv = s.idserv
    WHERE iddoc != ? AND ${satatment} ${conditioner}
    `, [req.session.IsAuthId]);
    return res.render("docteur/medcins", {doc , docs});
}

// settings doc
exports.showSettingsDoc = async function (req , res){
    var [doc] = await pool.query(`
        SELECT * FROM docteurs WHERE iddoc = ?;
    ` , [req.session.IsAuthId]);

    return res.render("docteur/parametre" , {doc})
}

exports.updateUser = async function (req ,res){
    var {name , fname , email , phone , ncin , pswd} = req.body;
    if (!pswd || pswd.trim() === "") {
        await pool.query(`
            UPDATE docteurs SET nom= ? ,prenom= ?, phone= ?, ncin= ? ,email=?
            WHERE iddoc = ?
        `,[name , fname , phone ,ncin , email , req.session.IsAuthId]);

        return res.redirect("/doc/settings");
    }else{
        const hashedPassword =await bcrypt.hash(pswd,10);
        await pool.query(`
            UPDATE docteurs SET nom= ? ,prenom= ?, phone= ?, ncin= ? ,email=? ,pswd =?
            WHERE iddoc = ?
        `,[name , fname , phone ,ncin , email ,hashedPassword ,req.session.IsAuthId]);
        return res.redirect("/doc/settings");
    }
}
/************************************************************************************************* */
// password forgot logique patient 

let from1 = "display:flex;"
let from2 = "display:none;"
let from3 = "display:none;"

// get request 

exports.showforgotpage = function (req ,res){
    res.render('forgot', {emailNotfound : emailNotfound, form1 : from1 , form2 : from2 , form3 : from3})
    emailNotfound = null
}

// post request 

//send code patient
exports.SendCode =async function(req,res){
    //get the email from the input form
    const {email} = req.body;
    // search if the email exists in the db (else send emailNotfound message then stop)
    const [verifyEmail] = await pool.query("Select idp from patients where email = ?",[email]);
    if(verifyEmail.length === 0 ||!verifyEmail){
        emailNotfound = email+" est jamais été inscrit dans notre hôpital";
        return res.redirect("/forgotpswd")
    }else{
        // generate the code 
        let code = generateRandomNumber();
        // send the code
        emailSender.sendmail(emailSender.transporter ,emailSender.init(email,"CODE DE CONFIRMATION",`CE CODE SERA PAS VALIDE SI VOUS NE L'UTILIZEZ
        PAS DANS 5 MINUTES <br> <strong>Le code : ${code}</strong>`));
         req.session.userCode = code.toString();
         req.session.pswdForgettenPatient = verifyEmail[0].idp;
        // hide the current form and show the next form
        from1 = "display:none;";
        from2 = "display:flex;" ;
        return res.redirect("/forgotpswd");
    }  
    // TODO : SET A TIMER  => it will be in the cokies 
}
//verify the send code patient
exports.verifySendCode =function(req,res){
    //get the code from the input
    const {code}=req.body ; 
    // verify the existence of the UserCode(if not send a message)
    // const localCode = localStorage.getItem("UserCode")
    if(!req.session.userCode){
        from1 = "display:none;";
        from2 = "display:flex;" ;
        emailNotfound = "le code est pas correct !!"
        return res.redirect("/forgotpswd");
    }else{
        // verify the code of the input and the UserCode (if they are not in match send a message)
        if(code === req.session.userCode){
            // hide the current form and show the next form
            from1 = "display:none;";
            from2 = "display:none;" ;
            from3 = "display:flex;" ;
            return res.redirect("/forgotpswd");
        }else{
            from1 = "display:none;";
            from2 = "display:flex;" ;
            emailNotfound = "le code est pas correct !!"
            return res.redirect("/forgotpswd");
        }
    }
}
//update patient password
exports.UpdatePatientPassword = async function(req ,res){
    // get the new password 
    const {newpassword} = req.body;
    // get the user id
    const userId = req.session.pswdForgettenPatient;
    //hash the password
    const hashedPassword =await bcrypt.hash(newpassword,10)
    //update the password
    await pool.query("UPDATE patients SET pswd = ? WHERE idp =?", [hashedPassword , userId])
    from1 = "display:flex;"
    from2 = "display:none;"
    from3 = "display:none;"
    return res.redirect("/auth");
}
/************************************************INSCRIPTION LOGIC************************************************* */

// FORGOT PSWD EMPLOYEES

let fromD1 = "display:flex;"
let fromD2 = "display:none;"
let fromD3 = "display:none;"

// get request 

exports.showforgotpageD = function (req ,res){
    res.render('forgotDoc', {emailNotfound : emailNotfound, form1 : fromD1 , form2 : fromD2 , form3 : fromD3})
    emailNotfound = null;
}

// post request 

exports.SendCodeD =async function(req,res){
    let isSec = false;
    const {email} = req.body;
    let [verifyEmail] = await pool.query("Select iddoc from docteurs where email = ?",[email]);
    if(verifyEmail.length === 0 ||!verifyEmail){
        [verifyEmail] = await pool.query("Select idsec from secritaires where email = ?",[email]);
        if(verifyEmail.length === 0 || !verifyEmail){
            emailNotfound = email +" Ne recemble pas a un de nous employes !";
            return res.redirect("/Dforgotpswd");
        }else{
            isSec = true;
        } 
    }
        let code = generateRandomNumber();
         // send the code 
        emailSender.sendmail(emailSender.transporter ,emailSender.init(email,"CODE DE CONFIRMATION",`CE CODE SERA PAS VALIDE SI VOUS NE L'UTILIZEZ
        PAS DANS 5 MINUTES <br> <strong>Le code : ${code}</strong>`));

         if(!isSec){
            req.session.docCode = code.toString();
            req.session.pswdForgettenDocteur = verifyEmail[0].iddoc;
         }else{
            req.session.secCode = code.toString();
            req.session.pswdForgettenSec = verifyEmail[0].idsec;
         }
         req.session.isSec = isSec;
        // hide the current form and show the next form
        fromD1 = "display:none;";
        fromD2 = "display:flex;" ;
        return res.redirect("/Dforgotpswd");
    }  
    // TODO : SET A TIMER  


exports.verifySendCodeD =function(req,res){
    //get the code from the input
    const {code} = req.body ; 
    // verify the existence of the UserCode(if not send a message)
    if(req.session.isSec === false){
        if(!req.session.docCode){
            fromD1 = "display:none;";
            fromD2 = "display:flex;" ;
            emailNotfound = "le code est pas correct !!"
            return res.redirect("/Dforgotpswd");
        }else{
            // verify the code of the input and the UserCode (if they are not in match send a message)
            if(code === req.session.docCode){
                // hide the current form and show the next form
                fromD1 = "display:none;";
                fromD2 = "display:none;" ;
                fromD3 = "display:flex;" ;
                return res.redirect("/Dforgotpswd");
            }else{
                fromD1 = "display:none;";
                fromD2 = "display:flex;" ;
                emailNotfound = "le code est pas correct !!"
                return res.redirect("/Dforgotpswd");
            }
        }
    }else{
        if(!req.session.secCode){
            fromD1 = "display:none;";
            fromD2 = "display:flex;" ;
            emailNotfound = "le code est pas correct !!"
            return res.redirect("/Dforgotpswd");
        }else{
            // verify the code of the input and the UserCode (if they are not in match send a message)
            if(code === req.session.secCode){
                // hide the current form and show the next form
                fromD1 = "display:none;";
                fromD2 = "display:none;" ;
                fromD3 = "display:flex;" ;
                return res.redirect("/Dforgotpswd");
            }else if(req.session.isSec === true){
                fromD1 = "display:none;";
                fromD2 = "display:flex;" ;
                emailNotfound = "le code est pas correct !!"
                return res.redirect("/Dforgotpswd");
            }else{
                return res.redirect("/")
            }
        }
    }
    
}

exports.UpdatePatientPasswordD = async function(req ,res){
    // get the new password 
    const {newpassword} = req.body;
    // get the user id
    if(req.session.isSec === false){
        const userId = req.session.pswdForgettenDocteur;
        //hash the password
        const hashedPassword =await bcrypt.hash(newpassword,10)
        //update the password
        await pool.query("UPDATE docteurs SET pswd = ? WHERE iddoc =? ", [hashedPassword , userId])
        fromD1 = "display:flex;"
        fromD2 = "display:none;"
        fromD3 = "display:none;"
        return res.redirect("/auth");
    }else if(req.session.isSec === true){
        const userId = req.session.pswdForgettenSec;
        //hash the password
        const hashedPassword =await bcrypt.hash(newpassword,10);
        //update the password
        await pool.query("UPDATE secritaires SET pswd = ? WHERE idsec =? ", [hashedPassword , userId])
        fromD1 = "display:flex;"
        fromD2 = "display:none;"
        fromD3 = "display:none;"
        return res.redirect("/auth");
    }
    
}
/************************************************INSCRIPTION LOGIC************************************************* */
// GET REQUEST DE PATIENT OU EMPLOYE

exports.showsignup = function (req, res){
    res.render('inscription', {err : errArray });
    errArray =[];
}
/************************************************************************************************* */
// INSCRIRE LE PATIENT (POST REQUEST DE PATIENT)

exports.signup =async function (req ,res){
    //get the values of the input field 
    const {name , fname , email , phone , Bday , cin , password} = req.body;
    //verify that the email is a valid one (else stop)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errArray =[];
        const errorArray = errors.array();
        errorArray.forEach(error => {
            errArray.push(error.msg)
        });
        return res.redirect("/signup");
    }else{
        //verify that the email is not in the liste of the patients (if not stop)
        const [IsemailExists] = await pool.query ("Select email from patients where email = ?",[email]);
        if (IsemailExists.length != 0){
            errArray =[];
            errArray.push("Email already exists");
            return res.redirect("/signup");
        }
        //hash the password
        const hashedPassword =await bcrypt.hash(password,10)
        const code = generateRandomNumber();
        emailSender.sendmail(emailSender.transporter ,emailSender.init(email,"CODE DE CONFIRMATION",`CE CODE SERA PAS VALIDE SI VOUS NE L'UTILIZEZ
        PAS DANS 5 MINUTES <br> <strong style = "background : lightred ;">Le code : ${code}</strong>`));

        req.session.UserInfos = [name , fname , Bday.toString(), phone ,cin ,hashedPassword , email];
        req.session.codeSignup = code.toString();
        return res.redirect("/signup/confirmEmail");
}}


/***********************************************************************************************************/
// get route for consfirming the email
let counter = 3; 
exports.ShowConfirmSignUp = function(req, res){
    res.render("confirmEmail", {counter : counter , emailNotfound : emailNotfound});
}
/***********************************************************************************************************/

exports.ConfirmSignUp =async function (req,res){

    const UserInfo = req.session.UserInfos;
    const {code} = req.body;
    if(!UserInfo){
        return redirect("/signup")
    }else{
        if(code === req.session.codeSignup){
            const uuid = crypto.randomUUID();
            const id = uuid.substring(0, 10);
            // const id = crypto.randomUUID();
            await pool.query('INSERT INTO `patients`(`idp`,`nom`, `prenom`, `birthdate`, `phone`, `ncin`, `pswd`, `email`) VALUES (?,?,?,?,?,?,?,?);',[id ,UserInfo[0],UserInfo[1],UserInfo[2],UserInfo[3],UserInfo[4],UserInfo[5],UserInfo[6]]);
            req.session.IsAuthId = id;
            return res.redirect(`/patient/accueil?suxgwxvx=${req.session.IsAuthId}`);
        }else{
            counter =counter-1;
            if(counter === 0){
                delete req.session.UserInfos;
                counter = 3;
                return res.redirect("/");
            }else{
                emailNotfound = "Le code vous avez saisir est incorecte"
                return res.redirect("/signup/confirmEmail");
            }
        }
    } 
}
/*******************************************************patient pages****************************************** */
// verify errs

// Dashboeard patient 
exports.userInterface = async function (req,res){
    if(req.session.IsAuthId){
        //Queries
// Get user info
        const [userinfo] = await pool.query("SELECT * FROM patients where idp = ?;",[req.session.IsAuthId]);
        const {nom , prenom , email} = userinfo[0];

// Get the LAST passed reservations of the user
        let [userreservation] = await pool.query("SELECT * FROM rdv where idp = ? and date_rdv < CURRENT_DATE() ORDER BY date_rdv DESC LIMIT 1;", [req.session.IsAuthId]);
        let derniereRs ;
        if(userreservation.length === 0){
            derniereRs = "--:--:--";
        }else{
            const {date_rdv} = userreservation[0];

            const date = new Date(date_rdv);
            date.setDate(date.getDate() + 1);
            derniereRs = date.toISOString().split('T')[0];
        }

// nombre de reservation totale
        const [totalreservation] = await pool.query(`SELECT COUNT(*) AS tot FROM rdv WHERE idp = ?;`,[req.session.IsAuthId]);
        const {tot} = totalreservation[0];

// nombre de reservation prochain
        const [prochainrdv] = await pool.query(`SELECT COUNT(*) AS procherdv FROM rdv WHERE idp = ? and date_rdv >= CURRENT_DATE();`,[req.session.IsAuthId]);
        
        const {procherdv} = prochainrdv[0];
// info sur le plus proche rdv prochain
        let [nextrdv] = await pool.query(`SELECT * FROM rdv WHERE idp = ? and date_rdv >= CURRENT_DATE() ORDER BY date_rdv ASC LIMIT 1;`,[req.session.IsAuthId])
        if(nextrdv.length === 0 ){
            nextrdv = [{idrdv : "--",	idp : null,	iddoc : null ,	idtemp :null,	date_rdv: "--:--:--",	heur_debut_rdv :"--:--" ,	heur_fin_rdv : "--",	type: 0}]
        }else{
            const dt = new Date(nextrdv[0].date_rdv);
            dt.setDate(dt.getDate() + 1);
            nextrdv[0].date_rdv = dt.toISOString().split('T')[0];
        }

// service de reservation
        let [service] = await pool.query(`SELECT s.nomserv AS service_name FROM services s INNER JOIN docteurs d ON s.idserv = d.idserv WHERE d.iddoc = ?;`,[nextrdv[0].iddoc]);
        if(service.length === 0 ){
            service = [{service_name : "--"}];
        }

// render the page with the nessisary informations 
        if(userinfo){
            if(userreservation.length === 0){
               userreservation = [{idrdv : "--",	idp : null,	iddoc : null ,	idtemp :null,	date_rdv: "--",	heur_debut_rdv :"--" ,	heur_fin_rdv : "--",	type: 0}];
            }
            
            res.render("AccueilP",{
                                    nom : nom ,
                                    prenom : prenom ,
                                    email : email ,
                                    totale : tot , 
                                    derniereRs : derniereRs,
                                    NprocheRDV : procherdv , 
                                    service : service ,
                                    nextrdv : nextrdv
            });
        }
         else{
            return res.redirect("/auth")
         }
    }else{
        res.redirect("/auth")
    }
    
}
/////////////////////////////////////////////////////////////
// Reserver patient
let reserv = [];
exports.reserverpatient = async function (req , res){
    const [user] = await pool.query("Select * from patients where idp = ?", [req.session.IsAuthId])
    res.render("reserverP",{nom : user[0].nom , prenom : user[0].prenom , email : user[0].email});
}
exports.showdatereserver = async function (req , res){
    let NotAllowedDate = []
    let [reservedAlredy] = await pool.query(`
    Select date_rdv as date 
    from rdv 
    join docteurs on rdv.iddoc = docteurs.iddoc
    join services on services.idserv = docteurs.idserv
    where rdv.idp=? and nomserv = ?`,[req.session.IsAuthId , reserv[0]]);
for (let i = 0; i < reservedAlredy.length; i++) {

    var datetime = reservedAlredy[i].date;
    const date = new Date(datetime);
    date.setDate(date.getDate() + 1);
    var datePart1 = date.toISOString();
    var datePart = datePart1.substring(0,10)
    NotAllowedDate.push(datePart);
}

    // let reservedDates = reservedAlredy.map(row => row.date.toISOString().split('T')[0]);
    const [user] = await pool.query("Select * from patients where idp = ?", [req.session.IsAuthId])
    res.render("reserverPdate",{nom : user[0].nom , prenom : user[0].prenom , email : user[0].email,NotAllowedDate : NotAllowedDate});
}
exports.showtimereserver = async function (req , res){
    // verify temps 
    // acceder a service ni ,verifier que le nombre maximal par heur pour chaque heure , 
    const [MaxInHour] = await pool.query("select patient_in_hour from services where nomserv = ?;",[reserv[0]]);
    let denied = [];
    let i = 0;
    while (i < 24) {
        let time = `${i}:00:00`;
        let timedenied = `${i}:00`
        let [result] = await pool.query(`SELECT COUNT(*) AS nbr FROM rdv WHERE heur_debut_rdv = ? AND date_rdv = ?;`, [time, reserv[1]]);
        if (result.length !== 0) {
            if (result[0].nbr === MaxInHour[0].patient_in_hour) {
                denied.push(timedenied);
            }
        }
        i++;
    }

    const [user] = await pool.query("Select * from patients where idp = ?", [req.session.IsAuthId]);
    const [enf] = await pool.query(" select * from enfants where idp =?",[req.session.IsAuthId])
    res.render("reserverPtime",{nom : user[0].nom , prenom : user[0].prenom , email : user[0].email , enf :enf , denied : denied});
}
exports.showconfirmreservice = async function (req , res){
    let exists = true;
    while(exists === true){
        const uuid = crypto.randomUUID();
        const id = uuid.substring(0, 5);
        const [responce] = await pool.query("Select * from rdv where idrdv = ?",[id]);
        if(responce.length === 0){
            reserv[5] = id
            exists = false;
        }  
    }

    const [user] = await pool.query("Select * from patients where idp = ?", [req.session.IsAuthId])
    res.render("reservationsValider",{nom : user[0].nom , prenom : user[0].prenom , email : user[0].email ,ticket : reserv });
}


// post request 
exports.reserverpatientChoixService = function (req , res){
    const choixserv = req.body.hiddenserv;
    if(choixserv ===""){
        return res.redirect("/patient/reserver")
    }else{
        reserv[0]=choixserv;
        return res.redirect("/patient/reserver/date")
    }
} 

exports.reserverpatientChoixDate = function (req , res){
    const choixdate = req.body.hiddendate;
    if(choixdate ===""){
        return res.redirect("/patient/reserver/date")
    }else{
        reserv[1]=choixdate;
        return res.redirect("/patient/reserver/time")
    }
}

exports.reserverpatientChoixtime = function (req , res){
    const choixtime = req.body.hiddentime;
    const enf = req.body.hiddenchiled;
    const enfv = req.body.hiddenchiledValue;
    if(choixtime ==="" || enf === ""){
        return res.redirect("/patient/reserver/time")
    }else{
        reserv[2]=choixtime+":00";
        reserv[3] = enf
        reserv[4] = enfv
        return res.redirect("/patient/reserver/confirm")
    }
}

exports.reserverpatientConfirm = async function (req , res){
    // we need the doctor id 
    const [iddoc] = await pool.query(`
        SELECT docteurs.iddoc As iddoc
        from docteurs 
        JOIN services ON docteurs.idserv = services.idserv 
        where nomserv = ?;
    ` , [reserv[0]]);

    if(iddoc.length === 0 ){
        return res.redirect("/patient/accueil")
    }else if(iddoc.length === 1){
        // we should cheak the time of work ...
        reserv[6] = iddoc[0].iddoc;
    }else{
        var random = Math.random()
        var index = Math.floor(random * iddoc.length);
        reserv[6] = iddoc[index].iddoc;
    }

    if(reserv[3] === "moi"){
        await pool.query(`
            INSERT INTO 
            rdv(idrdv, idp, iddoc, date_rdv, heur_debut_rdv)
            VALUES(?,?,?,?,?);
        `,[reserv[5] ,req.session.IsAuthId ,reserv[6] ,reserv[1] , reserv[2]]);
       reserv =[]
       return res.redirect("/patient/myreservations");
    }else{
        await pool.query(`
            INSERT INTO 
            rdv(idrdv, idp, iddoc, date_rdv, heur_debut_rdv ,idenf)
            VALUES(?,?,?,?,?,?);
        `,[reserv[5] ,req.session.IsAuthId ,reserv[6] ,reserv[1] , reserv[2] , reserv[4]]);
        reserv = []
       return res.redirect("/patient/myreservations");
    }
}
/////////////////////////////////////////////////
// Reservation patient

//GET REQUEST :

exports.reservationpatient = async function (req , res){
        if(req.session.IsAuthId){
            //Queries
    // Get user info
            const [userinfo] = await pool.query("SELECT * FROM patients where idp = ?;",[req.session.IsAuthId]);
            const {nom , prenom , email} = userinfo[0];
    
    //Get date , hours , service
            let statu = "display:block;";
            
            let [rdvs] = await pool.query(`
                SELECT rdv.idrdv , rdv.date_rdv, rdv.heur_debut_rdv, services.nomserv
                FROM rdv
                JOIN docteurs ON rdv.iddoc = docteurs.iddoc
                JOIN services ON docteurs.idserv = services.idserv
                WHERE rdv.idp = ? and services.nomserv like "${SearchkeywordServices}%"
                order by rdv.date_rdv ${orderFilterdates};` , [req.session.IsAuthId]);
            
                if(rdvs.length === 0){
                    // rdvs = [{idrdv : "" , date_rdv : "" , heur_debut_rdv : "" , nomserv : "" }]
                    statu = "display:none;"
                }
                
            res.render("reservationP", {nom : nom , prenom : prenom , email : email , rdvs : rdvs , statu :statu , newest : cheackedNewst , old :cheackedOldest });
        }
    }

// POST REQUESTs
    exports.deleterdv = async function(req,res){
        try{
            await pool.query(`DELETE FROM rdv WHERE idrdv = ?;`,[req.body.rdv]);
        }catch(error){
            console.log("Probleme !!")
        }
        res.redirect("/patient/myreservations");
    }

// Search by service

    exports.searchrdv = function(req, res) {
        SearchkeywordServices = req.body.searchInput;
        return res.redirect("/patient/myreservations")
    }

// filter by date 

exports.filterbydate = function(req, res) {
    orderFilterdates = req.body.selectedOption;
    if(orderFilterdates === "ASC"){
        cheackedNewst = ""
        cheackedOldest = "checked"
    }else{
        cheackedNewst = "checked"
        cheackedOldest = ""
    }
    res.redirect("/patient/myreservations");
}
// parametre patient
exports.parametrepatient = async function (req , res){
    let [user] = await pool.query("Select nom ,prenom ,email from patients where idp = ?;" , [req.session.IsAuthId]);
    const {nom , prenom , email} =user[0];
    res.render("parametreP", {nom , prenom , email});
}

exports.viewdetailspatient = async function (req , res){
// get the user info    
    let [user] = await pool.query("Select * from patients where idp = ?;" , [req.session.IsAuthId]);

// get the number of reservations
    let [nbrRdv] = await pool.query("Select count(*) As nbr from rdv where idp = ?;", [req.session.IsAuthId]);

//get enfants 
    let [enf] = await pool.query("Select * from enfants where idp = ?;",[req.session.IsAuthId]);
    res.render("ViewDetailsPatient" , {user : user , nmbr : nbrRdv,enf : enf});
}

exports.modifyinfoP =async function (req , res){
    const [patient] = await pool.query("SELECT * FROM patients where idp = ? ", [req.session.IsAuthId]);

    res.render("modifyinfop" , {patient})
}

// post requests for user infos 

// POST REQUEST TO MODIFY PERSSONELE INFORMATIONS
exports.ModifyperssonellInfo = async function(req ,res) {
    const {name , fname , bdate , ncin , phone , address} = req.body;
    if (name.length < 2 || fname.length < 2 || ncin.length !== 12 || phone.length <10 ) {
        return res.redirect("/patient/Settings/modifyinfop")
    }else{
        
        try{
            await pool.query(`
            Update patients set nom = ? , prenom = ?, birthdate = ? , ncin = ? , phone = ? , address = ?
            Where idp = ? ;
        `, [name , fname , bdate , ncin , phone , address , req.session.IsAuthId]);
        return res.redirect("/patient/Settings/viewdetails")

        }catch(err){
            console.log(err)
            return res.send("Sorry , an error ecured pls try again")
        }

    }
}

// POST REQUEST TO ADD A CHILD
exports.addChild = async function(req , res){
    const {cname , cfname , cbdate} = req.body;
    if(cname.length < 2 || cfname.length < 2 || cbdate < 8){
        return res.redirect("/patient/Settings/modifyinfop");
    }else{
        try{
            await pool.query(`
                INSERT INTO enfants (idp , nom , prenom , bdate)
                VALUES (?,?,?,?)
            `, [req.session.IsAuthId , cname , cfname , cbdate]);

            return res.redirect("/patient/Settings/viewdetails");
        }catch(err){
            return res.send("Sorry err ecured !!");
        }
    }
}

// POST REQUEST TO MODIFY Password 
exports.Securite = async function (req , res){
    const newPasswd = req.body.newpswd;
    if(newPasswd.length < 8){
        return res.redirect("/patient/Settings/modifyinfop");
    }else{
        try {
            const hashedPassword =await bcrypt.hash(newPasswd,10);
            await pool.query("UPDATE patients set pswd = ? where idp = ?",[hashedPassword , req.session.IsAuthId]);
            delete req.session.IsAuthId;
            return res.redirect("/");
        } catch (err) {
           return res.send("Sorry , an error has ecured try again !"); 
        }
    }
}


////////////////////////////////////////////////ADMIN////////////////////////////////////////////////////////////////////
//page accueil admin
exports.ShowAccueilAdmin = async function(req , res){
    // user info : admin 
    var [user]= await pool.query("SELECT * FROM admin WHERE idadmin = ? ;",[req.session.IsAuthId]);
    // nombre de services
    var [nbrserv] = await pool.query ("SELECT COUNT(*) as totserv FROM services;");
    // nobre de patients
    var [nbrpatient] = await pool.query("SELECT COUNT(*) AS totpatient FROM patients;")
    // nombre totale des medcins
    var [nbrmedcin] = await pool.query("SELECT COUNT(*) AS totdoc FROM docteurs;");
    // nombre totale des secritaires
    var [nbrsec] = await pool.query("SELECT COUNT(*) AS totsec FROM secritaires;");
    // nombre de reservation total 
    var [nbrrdv] = await pool.query("SELECT COUNT(*) AS totrdv FROM rdv;");
    // nombre de reservation d'haujourdui
    var [nbrrdvtoday] = await pool.query("SELECT COUNT(*) AS tottodayrdv FROM rdv where DATE(date_rdv) = CURRENT_DATE");
    // nombre de reservation pour le prochain 15 days
    var [nbrrdv15d] = await pool.query("SELECT COUNT(*) AS totnext15d FROM rdv where DATE(date_rdv) > CURRENT_DATE");
    // get all services and working docs and 
    var [serviceinfos] = await pool.query(
        `
            SELECT services.* , count(docteurs.iddoc) as nombreDocs
            from services
            join docteurs on services.idserv = docteurs.idserv
            group by services.nomserv;
        `);

    // todays rdvs
    var [todayrdv] = await pool.query(`
        SELECT services.nomserv ,count(idrdv) as nombreRdvs
        from services
        join docteurs on services.idserv = docteurs.idserv
        join rdv on rdv.iddoc = docteurs.iddoc
        group by services.nomserv;
    `);

    for (let i = 0; i < todayrdv.length; i++) {
        for (let j = 0; j < serviceinfos.length; j++) {
            if(todayrdv[i].nomserv === serviceinfos[j].nomserv){
                serviceinfos[j].nombreRdvs = todayrdv[i].nombreRdvs
            }  
        }
    }

    return res.render("admin/accueiladmin", {
        user,
        nbrserv,
        nbrpatient,
        nbrmedcin,
        nbrsec,
        nbrrdv,
        nbrrdv15d,
        nbrrdvtoday,
        serviceinfos,
    }
    );
} 
//////////
var searchterm = "'%'";
var condition = `WHERE nom like`;
var conditionS = `WHERE nom like`;
var searchtermSec = "'%'";
// search a doctors 

 // by name 
 exports.searchdocbyname = function(req, res){
    condition = `WHERE nom like`;
    return res.redirect("/admin/listdocs");
}
exports.searchdocbyservice = function(req, res){
    condition = `WHERE nomserv like`
    return res.redirect("/admin/listdocs");
}
exports.searchdocbymatricule = function(req, res){
    condition = `WHERE matricule like`
    return res.redirect("/admin/listdocs");
}
exports.searchbar = function (req ,res){
    var term = req.body.searchbar;
    searchterm = "'"+term+"%'"
    return res.redirect("/admin/listdocs");
}
// show the docteur list for : admin
exports.Showdocs = async function (req , res){
    // get admin info
    var [admin] = await pool.query("SELECT * FROM admin where idadmin = ? ",[req.session.IsAuthId]);
    // get docs infos
    var [docs] = await pool.query(`
        SELECT docteurs.* , services.nomserv
        FROM docteurs
        join services 
        on docteurs.idserv = services.idserv
        ${condition} ${searchterm};
    `);
    // get services

    var [services] = await pool.query("SELECT * FROM services;")
    return res.render("admin/listdocs" , {admin , docs , services});
}
// delete doc fro : admin
exports.deletedoc = async function (req , res){

    var docid = req.body.deldoc;
    try {
        await pool.query(`
           DELETE FROM docteurs
           WHERE iddoc = ?;`,[docid]
        );
        return res.redirect("admin/listdocs");
    }
     catch (error) {
        return res.send("Oppss a probleme apeared , please try again!!");
    }
}
// view doc 
exports.viewdoc = async function(req , res) { 
    var iddoc  = req.params.id
    try {
        var [doc] = await pool.query('SELECT * FROM docteurs WHERE iddoc = ? ;',[iddoc]);
        var [service] = await pool.query(`
            SELECT services.nomserv from services
            join docteurs on services.idserv = docteurs.idserv
            where docteurs.iddoc = ? ;
        `, [iddoc])
        var [admin] = await pool.query(`SELECT * FROM admin where idadmin = ? `,[req.session.IsAuthId]);
        res.render("admin/medcin", {doc , service,admin});
    } catch (error) {
        return res.send("...")
    }
}
// modify doc by : admin 
exports.modifydocbyadmin = async function (req , res) {
    var iddoc = req.params.id;
    var {address , phone , email} = req.body;
    await pool.query(`
            UPDATE docteurs 
            set address= ? , phone = ? , email = ?
            where iddoc = ?;` ,[address , phone , email , iddoc]);
        return res.redirect(`/viewdoc/${iddoc}`);
}

// doctor inscription by : admin 

exports.inscriredoc = async function(req , res){
    var {name , fname , bdate , email , phone , ncin , services} = req.body;
    if( name.length  < 3  || fname.length < 3   ||
        bdate.length < 8  || email.length < 8   ||
        phone.length < 10 || ncin.length !== 12 || services.length === 0){
            return res.redirect("/admin/listdocs");
    }else{
        var uuid = crypto.randomUUID();
        var iddoc = uuid.substring(0, 6);
        var matricule = generateRandomNumber();
        var hashedPassword =await bcrypt.hash(matricule,10)
        await pool.query(`
            INSERT INTO 
            docteurs(iddoc,matricule,nom, prenom, birthdate, phone,ncin, pswd,email,idserv)
            VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? );
        `,[iddoc , matricule , name , fname ,bdate , phone , ncin ,hashedPassword,email ,services])
        return res.redirect("/admin/listdocs");
    }
}




//show liste secritaires by admin
exports.Showsecs = async function(req , res ){
    // get admin info
    var [admin] = await pool.query("SELECT * FROM admin where idadmin = ? ",[req.session.IsAuthId]);
    // get admins : 
    try {
        var [admins] = await pool.query(`
            SELECT * 
            FROM secritaires
            ${conditionS} ${searchtermSec};
            `
        );
        return res.render("admin/listSec" , {admins , admin});
    } catch (error) {
        return res.send("Oops , un probleme a aperi refrecher !")
    }
}

exports.deletesec = async function(req , res){
    var secid = req.body.delsec ; 
    try {
        await pool.query(`
            DELETE FROM secritaires
            Where idsec = ? ;
        `, [secid])
        return res.redirect("/admin/listsec");
    } catch (error) {
        return res.send("Oppss a probleme apeared , please try again!!");
    }
}

exports.inscriresec = async function(req , res){
    var {name , fname , bdate , email , phone , ncin} = req.body;
    if( name.length  < 3  || fname.length < 3   ||
        bdate.length < 8  || email.length < 8   ||
        phone.length < 10 || ncin.length !== 12 ){
            return res.redirect("/admin/listdocs");
    }else{
        try {
            var uuid = crypto.randomUUID();
            var idsec = uuid.substring(0, 6);
            var matricule = generateRandomNumber();
            var hashedPassword =await bcrypt.hash(matricule,10)
    
            await pool.query(`
                INSERT INTO 
                secritaires(idsec,matricule,nom, prenom, birthdate, phone, email , ncin, pswd)
                VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? );
            `,[idsec , matricule , name , fname ,bdate , phone , email, ncin ,hashedPassword])
            return res.redirect("/admin/listsec");
        } catch (error) {
            return res.send("Oppss a probleme apeared , please try again!!");
        }

    }
}

exports.searchbarS = function (req ,res){
    var term = req.body.searchbar;
    searchtermSec = "'"+term+"%'"
    return res.redirect("/admin/listsec");
}

exports.searchsecbyname = function(req, res){
    conditionS = `WHERE nom like`;
    return res.redirect("/admin/listsec");
}


exports.searchsecbymatricule = function(req, res){
    conditionS = `WHERE matricule like`
    return res.redirect("/admin/listsec");
}
// show information of secritaire
exports.showsec = async function(req , res){
    try {
        var [admin] = await pool.query("SELECT * FROM admin where idadmin = ?",[req.session.IsAuthId]);
        var [sec] = await pool.query("SELECT * from secritaires where idsec = ? ", [req.params.id]);
        return res.render("admin/secritaire",{admin , sec});
    } catch (error) {
        return res.send("...");
    }
}
// modify information sec bby admin

exports.modifysecbyadmin = async function (req , res) {
    var idsec = req.params.id;
    var {address , phone , email} = req.body;
    await pool.query(`
            UPDATE secritaires 
            set address= ? , phone = ? , email = ?
            where idsec = ?;` ,[address , phone , email , idsec]);
        return res.redirect(`/viewsec/${idsec}`);
}
///////////////
// liste patient by admin
var searchtermp = "'%'";
var conditionp = `WHERE nom like`;

exports.Showlistpatient = async function(req , res){
    // admin info 
    var [admin] = await pool.query(`
        SELECT * FROM admin where idadmin = ?
    ` , [req.session.IsAuthId]);
    // get patient 
    var [patients] = await pool.query(`
        SELECT * FROM patients
        ${conditionp} ${searchtermp}
    ;`);

    return res.render("admin/listpatient" , {admin , patients});
} 

exports.searchpatbyname = function(req, res){
    conditionp = `WHERE nom like`;
    return res.redirect("/admin/listpat");
}

exports.searchpatbyemail = function(req, res){
    conditionp = `WHERE email like`
    return res.redirect("/admin/listpat");
}

exports.searchbarp = function (req ,res){
    var term = req.body.searchbar;
    searchtermp = "'"+term+"%'"
    return res.redirect("/admin/listpat");
}

exports.deletepatient = async function(req , res){
    var patient = req.body.deletepatient;
    try {
        await pool.query("DELETE FROM patients WHERE idp =?", [patient]);
        return res.redirect("/admin/listpat");
    } catch (error) {
        return
    }
}

// services by admin 

exports.ShowservicesByadmin = async function (req , res ){
    try {
        var [admin] = await pool.query(`SELECT * from admin where idadmin = ?;`,[req.session.IsAuthId]);
        var [services] = await pool.query(`SELECT * FROM services`);
        var [docteurs] = await pool.query("SELECT * from docteurs");

        for(let i = 0 ; i< services.length ; i++){
            var Ndocs = 0
            for(let j = 0 ; j <docteurs.length ; j++){
                if (services[i].idserv === docteurs[j].idserv) {
                    Ndocs ++;
                    services[i].docs = Ndocs;
                }
            }
        }
        return res.render("admin/services" , {admin , services});
    } catch (error) { 
        return res.send("...")
    }
}

// change hour capacity for a service by an admin 
exports.changeCapHour = async function(req , res){
    var idserv = req.params.idserv;
    var newValue = req.body.pat_H;

    try {
        await pool.query("UPDATE services set patient_in_hour = ? where idserv = ?;",[parseInt(newValue) , idserv]);
        return res.redirect("/admin/services");

    } catch (error) {
        return res.send("...")
    }
}

// Admin settings : 
exports.Adminsettings = async function(req , res){
    try {
        var [admin] = await pool.query("SELECT * FROM admin WHERE idadmin = ? ;",[req.session.IsAuthId]);
        return res.render("admin/parametre" , {admin});
    } catch (error) {
        return res.send("...")
    }
}

exports.ChangeAdminInfo = async function(req , res){
    var {name , fname , email , matricule} = req.body;

    if(!matricule){
        try {
            await pool.query(`
                UPDATE admin
                SET nom =? , prenom = ? , email = ? 
                WHERE idadmin = ? ;
            ` , [name , fname , email ,req.session.IsAuthId]);
            return res.redirect("/admin/Settings");
        } catch (error) {
            return res.send("...");
        }
    }else{
        const hashedPassword =await bcrypt.hash(matricule,10)
        try {
            await pool.query(`
                UPDATE admin
                SET nom =? , prenom = ? , email = ? , pswd = ? 
                WHERE idadmin = ? ;
            ` , [name , fname , email ,hashedPassword ,req.session.IsAuthId]);
            return res.redirect("/admin/Settings");
        } catch (error) {
            return res.send("...");
        }
    }
}

// COMPTE SECRITAIRE

exports.showSecritaire = async function(req ,res){
    var [sec] = await pool.query(`
        SELECT * FROM secritaires WHERE idsec = ? ;
    `,[req.session.IsAuthId]);

    // number of total patients
    var [numberOfpatient] = await pool.query(`
        SELECT COUNT(*) as nbr  FROM patients ;
    `);

    // number of docs 
    var [nombreOFdocs]  = await pool.query(`
        SELECT COUNT(*) as nbr FROM docteurs ;
    `);

    // number of services 
    var [numberservices] = await pool.query(`
        SELECT COUNT(*) as nbr FROM services;;
    `);

    // services
    var [services] = await pool.query(`
        SELECT * FROM services;
    `);

    // var nombreOf reservations
    var [nombreOFreservation] = await pool.query(`
        SELECT COUNT(*) AS nbr FROM rdv
        WHERE date_rdv >= CURRENT_DATE();
    `); 

    return res.render("sec/accueil",{sec , numberservices ,nombreOFreservation, numberOfpatient , nombreOFdocs , services});
}

exports.showrdv = async function(req ,res){
    var [sec] = await pool.query(`
        SELECT * FROM secritaires WHERE idsec = ? ;
    `,[req.session.IsAuthId]);

    var [services] = await pool.query(`
        SELECT * FROM services;
    `);
     res.render("sec/reserver" , {sec , services , Isresereved})
     Isresereved = null ;
}

exports.rdvTemp = async function (req , res){
    var {name , fname , bdate , ncin , service , date , time} = req.body;
    const uuid = crypto.randomUUID();
    const id = uuid.substring(0, 5);

    const uuidp = crypto.randomUUID();
    const idp = uuidp.substring(0, 10);
    // insert in patients temporaiare

        await pool.query(`
            INSERT INTO patients_temp (idtemp,nom, prenom, birthdate, ncin)
            values (? , ? , ? , ? , ?);
        `,[idp ,name , fname ,bdate ,ncin]);


    var [doc] = await pool.query(`
        SELECT d.iddoc
        FROM docteurs AS d
        JOIN services AS s ON d.idserv = s.idserv
        WHERE s.idserv = ? 
    `,[service[0]]);

    await pool.query(`
        INSERT INTO rdv (idrdv,iddoc, idtemp, date_rdv, heur_debut_rdv, type)
        VALUES ( ? , ? , ? , ? , ? , ?);
    `,[id ,doc[0].iddoc ,idp , date , time ,2]);
     
    Isresereved = true;
    res.redirect("/sec/reserver");
}


// SEC PATIENT 

var conditionerSP = '%';

exports.searchPatientsByname = function(req ,res){
    var term = req.body.name;
    conditionerSP = term
    return res.redirect("/sec/patients?search=" + encodeURIComponent(term)); // Pass the search term as a query parameter
}

exports.patientShow =async function(req , res){
    var [sec] = await pool.query(`SELECT * FROM secritaires WHERE idsec = ? ;`, [req.session.IsAuthId]);
    
    var term = req.query.search || ''; // Retrieve the search term from the query parameter
    var [patients] = await pool.query(`
        SELECT * FROM patients
        WHERE nom LIKE "%${term}%" OR
        prenom LIKE "%${term}%";
    `);

    return res.render("sec/patients" , {sec , patients});
}

var satatmentS = "d.nom LIKE"; 
var conditionerS = "'%'";

exports.searchbarSecr = async function(req ,res){
    var term = req.body.term
    conditionerS = `"%${term}%"`
    return res.redirect("/sec/medcins")
}

exports.searchbynomSecr = async function(req ,res){
    satatmentS = "d.nom LIKE";
    return res.redirect("/sec/medcins")
}

exports.searchbyservSecr = async function(req ,res){
    satatmentS = "nomserv LIKE";
    return res.redirect("/sec/medcins");
}

exports.showMedcinsBySec = async function(req , res){
    var [sec] = await pool.query(`
        SELECT * FROM secritaires WHERE idsec = ? ;
    `, [req.session.IsAuthId]);

    // get all docs 
    var [docs] = await pool.query(`
        SELECT d.*, nomserv FROM docteurs AS d
        JOIN services AS s ON d.idserv = s.idserv
        WHERE ${satatmentS} ${conditionerS}
    `);

    return res.render("sec/medcins" , {sec , docs});
}



exports.showSettingsSec = async function(req ,res){
    var [sec] = await pool.query(`SELECT * from secritaires WHERE idsec = ? `, [req.session.IsAuthId]);
    return res.render("sec/parametre" , {sec});
}

exports.updateSec = async function (req ,res){
    var {name , fname , email , phone , ncin , pswd} = req.body;
    if (!pswd || pswd.trim() === "") {
        await pool.query(`
            UPDATE secritaires SET nom= ? ,prenom= ?, phone= ?, ncin= ? ,email=?
            WHERE idsec = ?
        `,[name , fname , phone ,ncin , email , req.session.IsAuthId]);

        return res.redirect("/sec/settings");
    }else{
        const hashedPassword =await bcrypt.hash(pswd,10);
        await pool.query(`
            UPDATE secritaires SET nom= ? ,prenom= ?, phone= ?, ncin= ? ,email=? ,pswd =?
            WHERE idsec = ?
        `,[name , fname , phone ,ncin , email ,hashedPassword ,req.session.IsAuthId]);
        return res.redirect("/sec/settings");
    }
}


