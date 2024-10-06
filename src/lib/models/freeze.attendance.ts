import  { Schema, model, models } from "mongoose";

const freezeAttendanceSchema = new Schema({
    windowOpen: { type: Boolean, required: true, default: false },
});
  
  
  const Attendance = models?.Attendance || model('freezeAttendance', freezeAttendanceSchema);

  export default Attendance;