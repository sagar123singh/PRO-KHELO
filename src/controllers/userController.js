const User= require("../models/userModel")
const bcrypt= require("bcrypt")
const crypto=require("crypto")
const nodemailer= require("nodemailer")




////**************************************************************************************************************************************/
////************************************************login*********************************************************************************/
///************************************************************************************************************************************ */


exports.login=async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;

        if (Object.keys(data).length == 0) {return res.status(400).send({status: false,message: 'Email and Password fields are required'});
        }

        if (email===undefined || email.trim() == '') {
            return res.status(400).send({status: false,message: 'Email field is required ' });
        }

        if (password===undefined|| password.trim() == '') {
             return res.status(400).send({status: false,message: 'Password field is required '});
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(data.email.trim())) {
            return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
        }
    
        const userRes = await User.findOne({ email: email});
         if(!userRes) {
            return res.status(404).send({ status: false,message: 'Document does not exist with this email'});
        }
        bcrypt.compare(password, userRes.password, (err,result) => {
            if (result === true) {
            

            res.status(200).send({ status: true, message: " user login successful"})

            } else{
                return res.status(400).send({ status: false, message: "incorrect password" })
            }
        })
    } catch (err) {
        return res.status(500).send({status: false,error: err.message});
    }
}


////**************************************************************************************************************************************/
////************************************************Mail Credentials*********************************************************************/
///************************************************************************************************************************************ */

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    },
    tls:{
        rejectUnauthorized:false
    }
  });


///************************************************************************************************************************************ */
///************************************************************************************************************************************ */

exports.register=async(req,res)=>{
    try{
        const body=req.body
        /////////////////////////////validations////////////////////////////////////
    const requiredField=["firstName","lastName","email","password","confirmpassword"]
    for(i=0;i<requiredField.length;i++){
        if(body[requiredField[i]]===undefined){
            res.status(400).json({status:false,msg:`${requiredField[i]} is required`})
        }else if(body[requiredField[i]]===null || body[requiredField[i]]===" "){
            res.status(400).json({status:false,msg:`please enter ${requiredField[i]}`})
        }
    }
   
     if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(body.email.trim())) {
     return res.status(400).json({ status: false, message: 'Enter a valid Email Id' });
     }

     const repeatedEmail= await User.findOne({email:body.email})
     if(repeatedEmail){
        return res.status(400).json({status:false,msg:"Account already registered with this"})
     }

     if(body.password !== body.confirmpassword){
        return res.status(400).json({ status: false, message: 'password doesnot match' });
    }
    if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(body.password)){
        return res.status(400).json({status:false,message:"please enter alphanumeric and lowercase password"})
    }
    if (!(body.password.length > 8 && body.password.length <= 15)) {
        return res.status(400).json({status: false,message: 'Minimum password should be 8 and maximum will be 15'});
    }
    body.password = bcrypt.hashSync(body.password, 10);
    let user=new User({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        provider: "email",
        emailToken: crypto.randomBytes(64).toString("hex"),
        isVarified: false,
    })
   
    //////////////////////////////////data registering /////////////////////////
     const registerData= await user.save()
  var mailOptions ={
    from: process.env.FROM,
    to: process.env.TO,
    subject: "verify your email",
    html:`<h2>${user.username}! thanks for registering on our site</h2>
    <h4>please verify emails to continue..../</h4>
    <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">verify your email </a>`,
  };

    
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
        console.log(error);
    }else{
        console.log("verification email is sent to your email account " + info.response)
    }
  });
  res.status(201).json({status:true,msg:"registered successfully",data:registerData})  
    }catch(err){
        res.status(500).json({status:false,msg:err.msg})
        console.log("errrrrrr",err)
    }
}
exports.verify=async(req,res)=>{
    try{
        const token= req.query.token
        const user= await User.f({emailToken:token})
        if(user){
            user.emailToken=null
            user.isVerified=true
            await user.save()
            res.json({status:true,msg:"verified successfully"})
        }else{
            
            res.json({status:false,msg:"email is not verified"})
        }
    }catch(err){
        res.json({status:false,msg:err.msg})
    }
}



///************************************************************************************************************************************ */
///*************************************************************get all users****************************************************************** */
///************************************************************************************************************************************ */
///************************************************************************************************************************************ */

exports.getAllUsers=async(req,res)=>{
    const users= await User.find();
    res.status(200).json({success:true,totaluser:users.length, users})
}


///************************************************************************************************************************************ */
///*************************************************************update users****************************************************************** */
///************************************************************************************************************************************ */
///************************************************************************************************************************************ */

exports.updateUser= async(req,res)=>{
    let user=User.findById(req.params.id);
    if(!user){return res.status(404).json({success:false,message:"product not found"})}
    updateUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({success:true,updateUser})
}
