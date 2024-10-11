import  { Schema, model, models } from "mongoose";

const flagSchema = new Schema({
    userId : {type : String , required : true},
    Name : {type : String , required : true},
    flagCount: { type: Number, required: true },
});
  
  
  const FlagUsers = models?.FlagUsers || model('FlagUsers', flagSchema);

  export default FlagUsers;