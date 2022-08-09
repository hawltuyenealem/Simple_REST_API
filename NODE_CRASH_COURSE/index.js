const Person = require('./person');
const path = require("path")

const person = new Person("Dawit",15);
console.log(person.greating());

console.log(__dirname,"\n",path.extname(__filename));