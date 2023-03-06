const mongoose= require("mongoose")

const connectDatabase=()=>{
 mongoose.set("strictQuery", false);

mongoose.connect(process.env.URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
    console.log(`mongodb conncected with server data: ${data.connection.host}`);
})

}
module.exports=connectDatabase