class Person{
   constructor(name , age){
    this.name  = name;
    this.age = age;
   }

   greating(){
    console.log(`name: ${this.name} \n age: ${this.age}`);
   }
}

module.exports = Person ;