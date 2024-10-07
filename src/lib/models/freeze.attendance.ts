import  { Schema, model, models } from "mongoose";

const freezeAttendanceSchema = new Schema({
    userId : {type : String , required : true},
    windowOpen: { type: Boolean, required: true, default: false },
    time : {type : Number , required : true}
});
  
  
  const FreezeAttendance = models?.Attendance || model('freezeAttendance', freezeAttendanceSchema);

  export default FreezeAttendance;