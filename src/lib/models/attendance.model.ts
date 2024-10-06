import  { Schema, model, models } from "mongoose";

const attendanceSchema = new Schema({
    userId: { type: String, ref: 'User', required: true },
    date: { type: Date, required: true, unique: true }, // Date of attendance
    markedAt: { type: Date }, // Timestamp when the attendance was marked
    status: { type: String, enum: ['present', 'absent', 'flagged'], default: 'absent' },
    verified: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false }, // If the attendance is flagged
  });
  
  attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
  
  const Attendance = models?.Attendance || model('Attendance', attendanceSchema);

  export default Attendance;