const mongoose= require("mongoose")
const userSchema= new mongoose.Schema({
    firstName:{type:String,required:true,trim:true},
    lastName:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    isVerified: {type: Boolean,default: false},
    emailToken:{type:String},
    provider: {type: String,required: true,
    }
})
module.exports=mongoose.model("Register",userSchema)