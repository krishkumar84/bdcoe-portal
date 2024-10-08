import  { Schema, model, models } from "mongoose";

const freezeAttendanceSchema = new Schema({
    userId : {type : String , required : true},
    windowOpen: { type: Boolean, required: true, default: false },
});
  
  
  const FreezeAttendances = models?.FreezeAttendances || model('FreezeAttendances', freezeAttendanceSchema);

  export default FreezeAttendances;