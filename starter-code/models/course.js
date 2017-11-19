const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

//declaramos el esquema de los cursos con los mismos campos que declaramos en nuestra base de datos

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean,
  alumni: [],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
