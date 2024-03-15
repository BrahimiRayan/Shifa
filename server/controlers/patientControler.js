/************************************************************************************************* */

// VOUS TROUVEZ QUELLEQUE COMMENTAIRE EXPLICATIF SUR LE CODE QUI J'AI ECRIT SINO LES MOTS CLE SONT
// TODO : POUR FAIRE LA CHOSE
// REMENDER : POUR SEVIENNE DE CHANGER OU MODIFIER (SUR UN ASPECT DE SECURETE OU UNE BEST ALTERNATIVE)
// UNDER CONSIDERATION : A DESCUTER SI IL EXIST PLUS Q'UNE FACON A IMPLEMENTER LA CHOSE
// FOR TEST : JUST POUR TEST ET IL FAUT DE TROUVEZ UNE VRAI SOLUTION

// si vous avez des mots cle a ajouter 👆
/************************************************************************************************* */
const mysql = require("mysql2");
const bcrypt =require("bcrypt");
const {check ,validationResult} = require("express-validator")
require("dotenv").config()
const session = require('express-session');
/************************************************************************************************* */
/* les configuration seront deplacer ver .env file*/ 
var pool = mysql.createPool({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PSWD,
    database : process.env.DB
}).promise();
/************************************************************************************************* */
//leS message
let msg = null ;
let errArray =[];
let emailNotfound = null
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
        res.redirect("/home");
    }else{
        next ();
    }
}
/******************************************GLOBAL FUNCTIONS******************************************************* */
const crypto = require('crypto');

function generateRandomNumber() {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const eightDigitNumber = randomNumber % 100000000;

    return eightDigitNumber.toString().padStart(8, '0');
}

/************************************************************************************************* */

// EMAIL SENDER DONE !! FK YEAAAAAAAH !!
const emailSender = require("../controlers/emailsender.js");
const { userInfo } = require("os");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!! REMAINDER : TO CHANGE MY EMAIL TO THE WEB PAGE EMAIL AND PASSWORD.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Utuliser cette fonction pour sender les email (voir les parametre)
// emailSender.sendmail(emailSender.transporter ,emailSender.init(l'@ de receipient,titre de message, contenu de message));
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
// PATIENT POST REQUEST
exports.verifyAccountpatient = async function (req , res){
    //TODO: crypter le paswd => DONE
    const {email ,password_patient} = req.body;
    const [users] = await pool.query("SELECT * FROM patients;");
    
    if(!email || email === "" || !password_patient ||password_patient === ""){
        return res.redirect("/auth");
    }else{
        const compte = users.find(user => user.email.toUpperCase() === email.toUpperCase() );
        if(!compte){
            msg = " ❌ EMAIL EST INCORRECT !";
            res.redirect("/auth");
            return
        }else{
            const samePsword = await bcrypt.compare(password_patient,compte.pswd);
            if(samePsword){
                console.log("success")
                req.session.IsAuthId = compte.idp;
               return res.redirect("/home"); //GO TO HOME PAGE 
            }else{
                msg = " ❌ MOT DE PASSE EST INCORRECT !";
                res.redirect("/auth");
                return
            }
        }
    }
}
/************************************************************************************************* */
//EMPLOYEE POST REQUEST
exports.verifyAccountemploye = async function (req , res){
    /*TODO: crypter le paswd  => (UNTIL ADMIN FUNCTIONALITIES ADDED)*/
    const {matricule ,password_employe} = req.body;
    const [users] = await pool.query("SELECT * FROM docteurs;");
    if(!matricule || matricule === "" || !password_employe ||password_employe === ""){
        return res.redirect("/auth");
    }else{
        const compte = users.find(user => user.matricule === parseInt(matricule));
        if(!compte){
            const [secritaire] = await pool.query("Select * from secritaires;");
            const compteS = secritaire.find(user => user.matricule === parseInt(matricule));
            if(!compteS){
                msg = " ❌ Matricule n'existe pas ! ";
                return res.redirect("/auth");
            }else{
                const samePswordS = await bcrypt.compare(password_employe,compteS.pswd)
                if(samePswordS){
                    req.session.IsAuthId = compteS.idsec;
                   return res.redirect("/home");
                }else{
                    msg = " ❌ MOT DE PASSE INCORRECT ! ";
                    return res.redirect("/auth");
                }
            } 
        }else{
            const samePsword = await bcrypt.compare(password_employe,compte.pswd)
            if(samePsword){
                req.session.IsAuthId = compte.iddoc;
               return res.redirect("/home");
            }else{
                msg = " ❌ MOT DE PASSE INCORRECT ! ";
                return res.redirect("/auth");
            }
        }
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

exports.SendCode =async function(req,res){
    //get the email from the input form
    const {email} = req.body;
    console.log(email);
    // search if the email exists in the db (else send emailNotfound message then stop)
    const [verifyEmail] = await pool.query("Select idp from patients where email = ?",[email]);
    // console.log(verifyEmail[0].idp);
    if(verifyEmail.length === 0 ||!verifyEmail){
        emailNotfound = email+" est jamais ete inscrit dans notre hopital";
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
        if(!verifyEmail){
            emailNotfound = email+" Ne recemble pas a un de nous employes !";
            return res.redirect("/Dforgotpswd");
        }else{
            isSec = true;
        } 
    }
        let code = generateRandomNumber();
         // send the code 
        emailSender.sendmail(emailSender.transporter ,emailSender.init(email,"CODE DE CONFIRMATION",`CE CODE SERA PAS VALIDE SI VOUS NE L'UTILIZEZ
        PAS DANS 5 MINUTES <br> <strong>Le code : ${code}</strong>`));
         // FOR TEST : store in local storage
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
    const {code}=req.body ; 
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
        const hashedPassword =await bcrypt.hash(newpassword,10)
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

// REMENDER : (!! TO IMPROVE THIS SHIT TO INSERT THE PATIENT AFTER THE EMAIL VERIFICATION !!)
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
    let chances = 3;
    const UserInfo = req.session.UserInfos;
    const {code} = req.body;
    console.log(UserInfo[1]);
    if(!UserInfo){
        return redirect("/signup")
    }else{
        if(code === req.session.codeSignup){
            const uuid = crypto.randomUUID();
            const id = uuid.substring(0, 10);
            // const id = crypto.randomUUID();
            await pool.query('INSERT INTO `patients`(`idp`,`nom`, `prenom`, `birthdate`, `phone`, `ncin`, `pswd`, `email`) VALUES (?,?,?,?,?,?,?,?);',[id ,UserInfo[0],UserInfo[1],UserInfo[2],UserInfo[3],UserInfo[4],UserInfo[5],UserInfo[6]]);
            req.session.IsAuthId = id;
            return res.redirect("/home");
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
/************************************************************************************************* */