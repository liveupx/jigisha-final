// const mongoose = require('mongoose');
// const validator = require('validator');
// const schema = mongoose.Schema;

// const patientSchema = new schema({
//     fullName: {type: String, required: true, trim: true, minlength: 3, maxLength: 50},
//     age: {type: Number, min: 0, max: 150}, 
//     gender: {type: String, 
//         validate(value) {
//             if(!["male", "female", "other"].includes(value.toLowerCase())) {
//                 throw new Error("Invalid gender");
//             }
//         }
//     },

//     photoUrl: {type: String, default: 'https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png'},
//     about: {type: String, maxLength: 500},
//     skills: {type: [String], 
//         validate(value) {
//             if(value.length > 50) {
//                 throw new Error("At Max 50 skills are allowed");
//             }
//         }
//     },
// },
// {
//     timestamps: true
// });


// const Patient = mongoose.model('Patient', patientSchema);
// module.exports = Patient;