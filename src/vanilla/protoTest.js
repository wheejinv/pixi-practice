/**
 * Created by wheej on 2018-06-24.
 */

var person = {
    name: "whee",
    getName: function() {
        return this.name;
    },
    setName: function( arg ) {
        this.name = arg;
    }
};
function create_object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

var student = create_object( person );

student.setName("me");

console.log( student.getName() );