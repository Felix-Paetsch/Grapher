Grapher = new GraphObj();
UI = new UserInterface();

var inputSpan = document.getElementById('input');
var inputField = MQ.MathField(inputSpan, {
    autoOperatorNames: 'ln lb log lg sec csc coth sech csch random sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
    autoCommands: 'pi',
    handlers: {
        edit: function() {
            var enteredMath = inputField.latex();

            console.log(enteredMath);
            console.log(new Parser().parse(enteredMath));

            Grapher.updateFunction(0, enteredMath);
            if (checkForReplacementNeeded(inputField.latex())){
                inputField.latex(replaceLatex(replaceLatex(inputField.latex())));
            }
        }
    }
});

function checkForReplacementNeeded(expr){
    return  /nthroot/g.test(expr) || /^sqrt|[^\\]sqrt/g.test(expr);
}

function replaceLatex(expr){
    return expr.replace(/nthroot/g, "\\sqrt[]{}")
                .replace(/^sqrt/g, "\\sqrt{}")
                .replace(/([^\\])sqrt/g, "$1" + "\\sqrt{}")
}