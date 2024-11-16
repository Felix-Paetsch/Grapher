class Parser{
    constructor(){}
    parse(expr){
        this.noError = true;
        var tree = new Node(this.replace(expr), this);
        if (this.noError) return tree.toString();
        return false;
    }

    parseNoX(expr){
        this.noError = true;
        var tree = new Node(this.replace(expr), this);
        if (this.noError) var t = tree.toString();

        if (this.noError && t.indexOf("x") === -1) return t;
        return false;
    }

    replace(expr){
        return expr.replace(/\\left\|/g, "|(")
                   .replace(/\\right\|/g, ")|")
                   .replace(/\[/g, "[(")
                   .replace(/\]/g, ")]")
                   .replace(/\\left|\\right|\\\ |\ /g, "")
                   .replace(/^\.|([^0-9])\./g, "$1" + "0.");
    }
    
    callError(){
        this.noError = false;
    }
}

class Node{
    constructor(expr, parent){
        this.p = parent;
        this.expr = expr.replace(/\,/g, ".");
        this.childNodes = [];
        this.op = "";
        this.outerbrackets = false;
        this.bracketscount = [];
        this.checkOuterBrackets();
        this.createInsideBracketsArray();
        this.parseExpression();
    }

    callError(){
        this.p.callError();
    }

    createInsideBracketsArray(){
        var bracketscount = 0;
        this.bracketscount.length = this.expr.length;
        for (var i = 0; i < this.expr.length; i++){
            if (this.expr[i] == "(" || this.expr[i] == "{") bracketscount++;
            if (this.expr[i] == ")" || this.expr[i] == "}") bracketscount--;
            this.bracketscount[i] = bracketscount;
        }
    }

    checkOuterBrackets(){
        var bracketscount = 1;
        var minb = -1;
        if ((this.expr[0] == "(" || this.expr[0] == "{") && (this.expr[this.expr.length-1] == ")" || this.expr[this.expr.length-1] == "}")){
            var minb = 1;
            for (var j = 1; j < this.expr.length-2; j++){
                if (this.expr[j] == "(" || this.expr[j] == "{") bracketscount++;
                if (this.expr[j] == ")" || this.expr[j] == "}") bracketscount--;
                if (bracketscount < minb) minb = bracketscount;
            }
        }
        if (minb > 0){
            this.outerbrackets = true;
            this.expr = this.expr.substring(1, this.expr.length-1);
            this.checkOuterBrackets();
        }
    }

    parseExpression(){
        //parse simple opperations
        var possibles = ["+","-","\\cdot", ""];
        var currentPos = 0;
        var posNfound = true;
        var i = 0;
        while (i < possibles.length && posNfound){
            for (var j = 0; j < this.expr.length; j++){
                if (posNfound && this.expr.substring(j, j+possibles[i].length) == possibles[i] && this.bracketscount[j] == 0){
                    currentPos = j;
                    posNfound = false;
                }
            }
            i++;
        }
         
        switch (possibles[i-1]){
            case "+": 
            case "-":
                if (currentPos === 0) {  
                    this.expr = "(0" + this.expr[currentPos] + "1)\\cdot" +  this.expr.substring(1);
                    this.checkOuterBrackets();
                    this.createInsideBracketsArray();
                    this.parseExpression();
                } else if (this.expr[currentPos-1] === "+" || this.expr[currentPos-1] === "-" || this.expr.substring(currentPos-5, currentPos) === "\\cdot"){
                    this.expr = this.expr.substring(0, currentPos) + "(0" + this.expr[currentPos] + "1)\\cdot" + this.expr.substring(currentPos+1);
                    this.checkOuterBrackets();
                    this.createInsideBracketsArray();
                    this.parseExpression();
                } else {
                    var splitted1 = this.expr.substring(0, currentPos);
                    var splitted2 = this.expr.substring(currentPos+1);
                    this.op = possibles[i-1];
                    
                    this.childNodes.push(
                        new Node(splitted1, this),
                        new Node(splitted2, this)
                    );
                }
                return; 
            case "\\cdot":
                var splitted1 = this.expr.substring(0, currentPos);
                var splitted2 = this.expr.substring(currentPos+5);
                this.op = "*";
                
                this.childNodes.push(
                    new Node(splitted1, this),
                    new Node(splitted2, this)
                );
                return;   
        }

        //parse logn
        if (this.expr.startsWith("\\log_")){
            if (this.expr.length === 5){
                this.callError();
                return;
            }
            if (this.expr[5] !== "{" && this.expr[5] !== "(") {
                var endOfBase = 5;
                var b1 = false;
            }
            else {
                var j = 5;
                while (j < this.expr.length){
                    if (0 == this.bracketscount[j]) break;
                    j++; 
                }
                var endOfBase = j;
                var b1 = true;
            }
            if (this.expr[endOfBase+1] !== "{" && this.expr[endOfBase+1] !== "("){
                var endOfArg = endOfBase+1;
                var b2 = false;
            }
            else {
                var j = endOfBase+1;
                while (j < this.expr.length){
                    if (0 == this.bracketscount[j]) break;
                    j++; 
                }
                var endOfArg = j;
                var b2 = true;
            }
            if (endOfArg == this.expr.length) {
                this.callError();
                return;
            }
            if (endOfArg+1 == this.expr.length){
                this.op = "logn";
                if (b1) this.childNodes.push(new Node(this.expr.substring(6, endOfBase), this))
                else this.childNodes.push(new Node(this.expr.substring(5, endOfBase+1), this));
                if (b2) this.childNodes.push(new Node(this.expr.substring(endOfBase+2, this.expr.length-1), this))
                else this.childNodes.push(new Node(this.expr.substring(endOfBase+1), this));
            } else if(this.expr[endOfArg+1] == "^") {
                this.parsePower(endOfArg+1);
            } else {
                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, endOfArg+1), this), 
                    new Node(this.expr.substring(endOfArg+1), this)
                )
            }
            return;
        }

        //parse functions
        possibles = ["\\operatorname{lb}", "\\ln", "\\operatorname{abs}", "\\lg", "\\sec", "\\log", "\\operatorname{cosec}", "\\operatorname{sech}", "\\csc","\\coth", "\\arctan","\\operatorname{arctanh}","\\operatorname{arcsinh}","\\operatorname{arccosh}","\\exp","\\arcsin","\\arccos","\\operatorname{sign}", "\\cosh", "\\sinh", "\\tanh", "\\sin", "\\tan", "\\cos", "\\cot", "\\operatorname{cotan}", "\\operatorname{cotanh}", "\\operatorname{ceil}", "\\operatorname{floor}", "\\min", "\\max"];
        for (var i = 0; i < possibles.length; i++){
            if (this.expr.indexOf(possibles[i]) === 0 && this.expr.length > possibles[i].length){
                var endOfExpr = 0;

                if (this.expr[possibles[i].length] == "|") {
                    //absolute value
                    if (possibles[i] == "\\min" || possibles[i] == "\\max") this.callError();
                    var bcounter = 1;
                    for (var j = possibles[i].length+1; j < this.expr.length - 2; j++){
                        if (this.bracketscount[j] < bcounter) bcounter = this.bracketscount[j];
                        if (bcounter === 0) break;
                    }
                    if (bcounter > 0){
                        this.op = possibles[i].substring(1);
                        this.childNodes.push(new Node(this.expr.substring(possibles[i].length, this.expr.length), this));
                        return;
                    }
                    endOfExpr = j+1;
                } else if (this.expr[possibles[i].length] !== "{" && this.expr[possibles[i].length] !== "("){
                    //no brackets
                    if (possibles[i] == "\\min" || possibles[i] == "\\max") this.callError();
                    endOfExpr = possibles[i].length;
                    if (this.expr.length == endOfExpr + 1){
                        this.op = possibles[i].substring(1);
                        this.childNodes.push(new Node(this.expr.substring(endOfExpr), this));
                        return;
                    }
                } else {
                    //there are brackets
                    var bcounter = 1;
                    for (var j = possibles[i].length; j < this.expr.length - 1; j++){
                        if (this.bracketscount[j] < bcounter) bcounter = this.bracketscount[j];
                        if (bcounter === 0) break;
                    }
                    if (bcounter > 0){
                        this.op = possibles[i].substring(1);
                        if (this.op == "min" || this.op == "max") this.parseMinMax(this.expr.substring(5,this.expr.length-1))
                        else this.childNodes.push(new Node(this.expr.substring(possibles[i].length+1, this.expr.length-1), this));
                        return;
                    }
                    endOfExpr = j;
                }

                if (this.expr[endOfExpr+1] == "^"){
                    this.parsePower(endOfExpr+1);
                    return;
                } else {
                    this.op = "*";
                    this.childNodes.push(
                        new Node(this.expr.substring(0, endOfExpr+1), this), 
                        new Node(this.expr.substring(endOfExpr+1), this)
                    )
                }
               return;
            }
        }

        //parse Numbers
        if (/^0+$/.test(this.expr)) this.expr = "0";
        if(this.expr[this.expr.length-1] == ".") this.callError();
        if (/^[0-9.]+$/.test(this.expr)) return;
        var endOfNumber = 0;
        if (/^[0-9.]+$/.test(this.expr.substring(0,1))) endOfNumber = 1;
        while (/^[0-9.]+$/.test(this.expr.substring(0,endOfNumber)) && endOfNumber < this.expr.length){
            endOfNumber++;
        }
        if (endOfNumber > 0){
            if (this.expr[endOfNumber-1] == "^"){
                this.parsePower(endOfNumber-1);
                return;
            } else {
                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, endOfNumber-1), this), 
                    new Node(this.expr.substring(endOfNumber-1), this)
                )
            }

            return;
        }
        
        //parse constants + x
        possibles = ["x", "\\pi", "e"];
        for (var i = 0; i < possibles.length; i++){
            var regex = new RegExp("^(" + possibles[i].replace(/\\/, "\\\\") + ")+$");
            if (regex.test(this.expr)){
                if (this.expr.length > possibles[i].length) {
                    this.expr = this.expr.match(new RegExp('.{1,' + possibles[i].length + '}', 'g')).join("\\cdot");
                    this.checkOuterBrackets();
                    this.createInsideBracketsArray();
                    this.parseExpression();
                } else {
                    if (i == 1) this.expr = "Math.PI";
                    if (i == 2) this.expr = "Math.E";
                }
                return;
            }
            var endOfNumber = 0;
            if (regex.test(this.expr.substring(0,possibles[i].length))) endOfNumber = possibles[i].length;
            while (regex.test(this.expr.substring(0,endOfNumber)) && endOfNumber < this.expr.length){
                endOfNumber+=possibles[i].length;
            }
            if (endOfNumber > 0){
                if (this.expr[endOfNumber-possibles[i].length] == "^"){
                    this.parsePower(endOfNumber-possibles[i].length);
                } else {
                    this.op = "*";
                    this.childNodes.push(
                        new Node(this.expr.substring(0, endOfNumber-possibles[i].length), this), 
                        new Node(this.expr.substring(endOfNumber-possibles[i].length), this)
                    )
                }
                return;
            }
        }

        //parse Brackets
        if (this.expr[0] === "(" || this.expr[0] === "{"){
            var j = 1;
            while (this.bracketscount[j] > 0) j++;
            //check for power
            if (this.expr[j+1] == "^"){
                if (this.expr[j+2] != "(" && this.expr[j+2] != "{"){
                    var endOfPower = j+2;
                } else {
                    bcounter = 1;
                    for (var m = j+3; m < this.expr.length - 1; m++){
                        if (this.bracketscount[m] < bcounter) bcounter = this.bracketscount[m];
                        if (bcounter === 0) break;
                    }
                    var endOfPower = m;
                }
                if (this.expr.length === endOfPower + 1){
                    this.op = "^";
                    if (this.expr[j+2] == "(" || this.expr[j+2] == "{"){
                        this.childNodes.push(
                            new Node(this.expr.substring(1, j), this), 
                            new Node(this.expr.substring(j+3, this.expr.length-1), this)
                        );
                    } else {
                        this.childNodes.push(
                            new Node(this.expr.substring(1, j), this), 
                            new Node(this.expr.substring(j+2), this)
                        );
                    }
                    return;
                }
                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, endOfPower+1), this),
                    new Node(this.expr.substring(endOfPower+1), this),
                );
                return;
            }
            if (j != this.expr.length) {
                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, j+1), this), 
                    new Node(this.expr.substring(j+1), this)
                )
                return;
            }
        }

        //parse fractions
        if (this.expr.substring(0, 5) == "\\frac"){
            var j = 6;
            while (this.bracketscount[j] > 0) j++;
            var k = j+2;
            while (this.bracketscount[k] > 0) k++;

            if (this.expr.length === k+1){
                this.op = "/";
                this.childNodes.push(
                    new Node(this.expr.substring(6, j), this), 
                    new Node(this.expr.substring(j+2,k), this)
                );
                return;
            } else {
                if (this.expr[k+1] == "^"){
                    this.parsePower(k+1);
                    return;
                }

                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, k+1), this), 
                    new Node(this.expr.substring(k+1), this)
                );
            }
            return;
        }

        //parse root
        if (this.expr.startsWith("\\sqrt")){
            if (this.expr == "\\sqrt"){
                this.callError();
                return;
            }
            if (this.expr[5] != "["){
                var j = 6;
                while (this.bracketscount[j] > 0) j++;
                if (this.expr.length === j+1){
                    this.op = "sqrt";
                    this.childNodes.push(
                        new Node(this.expr.substring(6,j), this)
                    );
                    return;
                } else {
                    if (this.expr[j+1] == "^"){
                        this.parsePower(j+1);
                        return;
                    }
                    this.op = "*";
                    this.childNodes.push(
                        new Node(this.expr.substring(0, j+1), this), 
                        new Node(this.expr.substring(j+1), this)
                    );
                }
                return;
            } else {
                var bcount = 1;
                var j = 5;
                while (j < this.expr.length && bcount > 0){
                    j++;
                    if (this.expr[j] == "[") bcount++;
                    if (this.expr[j] == "]") bcount--;
                }
                var k = j;
                if (k+1 == this.expr.length) {
                    this.callError();
                    return;
                }
                j++;
                while (this.bracketscount[j] > 0) j++;
                if (this.expr.length === j+1){
                    this.childNodes.push(
                        new Node(this.expr.substring(7, k-1),this)
                    );

                    this.op = "nroot";
                    this.childNodes.push(
                        new Node(this.expr.substring(k+2, this.expr.length-1), this)
                    );
                } else {
                    if (this.expr[j+1] == "^"){
                        this.parsePower(j+1);
                        return;
                    }
                    this.op = "*";
                    this.childNodes.push(
                        new Node(this.expr.substring(0, j+1), this), 
                        new Node(this.expr.substring(j+1), this)
                    );
                }
                return;
            }
        }

        //parse absolute value
        if (this.expr[0] === "|"){
            var endnfound = true;
            var i = 1
            while (endnfound && i < this.expr.length){
                i++;
                if (this.bracketscount[i] === 0) endnfound = false;
            }
            if (this.expr.length == i+2){
                this.op = "abs";
                this.childNodes.push(
                    new Node(this.expr.substring(2, this.expr.length-2), this)
                );
            } else if (this.expr[i+2] !== "^"){ 
                this.op = "*";
                this.childNodes.push(
                    new Node(this.expr.substring(0, i+2), this),
                    new Node(this.expr.substring(i+2), this)
                );
            } else {
                this.parsePower(i+2);
            }
            return;
        }

        //falsche eingabe
        this.callError();
    }

    parsePower(j){
        if (this.expr[j+1] != "(" && this.expr[j+1] != "{"){
            var endOfPower = j+1;
        } else {
            var bcounter = 1;
            for (var m = j+2; m < this.expr.length - 1; m++){
                if (this.bracketscount[m] < bcounter) bcounter = this.bracketscount[m];
                if (bcounter === 0) break;
            }
            var endOfPower = m;
        }
        if (this.expr.length === endOfPower + 1){
            this.op = "^";
            if (this.expr[j+1] == "(" || this.expr[j+1] == "{"){
                this.childNodes.push(
                    new Node(this.expr.substring(0, j), this), 
                    new Node(this.expr.substring(j+2, this.expr.length-1), this)
                );
            } else {
                this.childNodes.push(
                    new Node(this.expr.substring(0, j), this), 
                    new Node(this.expr.substring(j+1), this)
                );
            }
            return;
        } else if (this.expr.length === endOfPower){
            this.callError();
            return;
        }
        this.op = "*";
        this.childNodes.push(
            new Node(this.expr.substring(0, endOfPower+1), this),
            new Node(this.expr.substring(endOfPower+1), this),
        );
    }

    parseMinMax(s){
        var j = 0;
        for (var i = 0; i < s.length; i++){
            if (this.bracketscount[i] == 0 && s[i] == ";"){
                this.childNodes.push(new Node(s.substring(j,i), this));
                j = i+1;
            }
        }
        this.childNodes.push(new Node(s.substring(j), this));
        if (s.length == 0){
            this.callError();
        }
    }

    toString(){
        var result = "";
        if (this.outerbrackets) result += "(";

        switch (this.op){
            case "+": 
            case "-":
            case "*":
                result += this.childNodes[0].toString() + this.op + this.childNodes[1].toString();
                break;
            case "sin":
            case "tan":
            case "cos":
            case "cot":
            case "cosh":
            case "sinh":
            case "tanh":
            case "sqrt":
            case "abs":
            case "exp":
                result += "Math." + this.op + "(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{abs}":
                result += "Math.abs(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{cotan}":
                result += "1/Math.tan(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{cotanh}":
            case "coth":
                result += "1/Math.tanh(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{floor}":
                result += "Math.floor(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{ceil}":
                result += "Math.ceil(" + this.childNodes[0].toString() + ")";
                break;
            case "^":
                result += "Math.pow(" + this.childNodes[0].toString() + "," + this.childNodes[1].toString() + ")";
                break;
            case "/":
                result += "(" + this.childNodes[0].toString() + ")/(" + this.childNodes[1].toString() + ")";
                break;
            case "min":
            case "max":
                result += "Math." + this.op + "(";
                for (var i = 0; i < this.childNodes.length-1; i++) result += this.childNodes[i].toString() + ",";
                result += this.childNodes[i] + ")";
                break;
            case "arctan":
                result += "Math.atan(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{arctanh}":
                result += "Math.atanh(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{arcsinh}":
                result += "Math.asinh(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{arccosh}":
                result += "Math.acosh(" + this.childNodes[0].toString() + ")";
                break;
            case "arcsin":
                result += "Math.asin(" + this.childNodes[0].toString() + ")";
                break;
            case "arccos":
                result += "Math.acos(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{sign}":
                result += "Math.sign(" + this.childNodes[0].toString() + ")";
                break;
            case "sec":
                result += "1/Math.cos(" + this.childNodes[0].toString() + ")";
                break;
            case "csc":
            case "operatorname{cosec}":
                result += "1/Math.sin(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{sech}":
                result += "1/Math.cosh(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{csch}":
                result += "1/Math.sinh(" + this.childNodes[0].toString() + ")";
                break;
            case "nroot":
                result += "Math.pow(" + this.childNodes[1].toString() + "," + "1/(" + this.childNodes[0].toString() + "))";
                break;
            case "ln":
            case "log":
                result += "Math.log(" + this.childNodes[0].toString() + ")";
                break;
            case "lg":
                result += "Math.log10(" + this.childNodes[0].toString() + ")";
                break;
            case "operatorname{lb}":
                result += "Math.log2(" + this.childNodes[0].toString() + ")";
                break;
            case "logn":
                //log_a(b) = log_c(b)/log_c(a)
                result += "Math.log(" + this.childNodes[1].toString() + ")/Math.log(" + this.childNodes[0].toString() + ")";
                break;
            case "": 
                result += this.expr;
                break;
        }
        if (this.outerbrackets) result += ")";
        return result;
    }
}