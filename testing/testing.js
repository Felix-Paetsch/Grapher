class Expect{
    constructor(){
        this.tests = [];
    }

    testAll(){
        var errorCount = 0;
        for (var i = 0; i < this.tests.length; i++){
            if (this.tests[i][0] != this.tests[i][1]) {
                console.error(this.tests[i][2] + ": \"" + this.tests[i][1] + "\" expected, but \"" + this.tests[i][0] + "\" got.");
                errorCount++;
            }
        }
        console.log("Total Tests: ", this.tests.length);
        console.log("errorcount: ", errorCount);
    };

    add(value, expected, description){
       this.tests.push([value, expected, description]); 
    }
}