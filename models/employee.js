const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    designation: { type: String, required: true },
    salary: { type: Number, required: true, min: 1000 },
    date_of_joining: { type: Date },
    department: { type: String, required: true },
    employee_photo: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
