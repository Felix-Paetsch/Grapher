tests = new Expect();

p = new Parser();


tests.add(typeof p.parse("3"), 'string', "Pase-output should be string");
tests.add(typeof new Node("93").toString(), 'string', "Pase-output should be string");
tests.add(p.parse("3"), '3', "Parse Integer to be Integer.");
tests.add(p.parse("3+4"), '3+4', "Parse integer sum to be integer sum");
tests.add(p.parse("3\\cdot4"), '3*4', "Parse integer product to be integer product");
tests.add(p.parse("3   \\cdot 4"), '3*4', "Parse integer product with some spaces to be integer product");
tests.add(p.parse("3  + 4"), "3+4", "Sum two Integers with spaces.")
tests.add(p.parse("3\\cdot4"), "3*4", "Use Parser to parse Integer Product");
tests.add(p.parse("3-4"), "3-4", "Support simple subtraction");
tests.add(p.parse("3\\cdot4+2"),"3*4+2", "Combine sum and product");
tests.add(p.parse("3\\cdot4\\cdot2"),"3*4*2", "Multiple factors");
tests.add(p.parse("3\\cdot4+3\\cdot2"),"3*4+3*2", "Sum two products");
tests.add(p.parse(" 3 \\cdot (4\\cdot 2+ 3)"), "3*(4*2+3)", "Brackets with simple sum.");
tests.add(p.parse("3\\cdot\\left(2+2\\right)-3"), "3*(2+2)-3", "Some more simple tests");
tests.add(p.parse(" (  2 ) +2 "), "(2)+2", "Remove spaces in brackets");
tests.add(p.parse("3+4\\cdot3+(4\\cdot2)"), "3+4*3+(4*2)", "Parse addition before multiplication");
tests.add(p.parse("(((3+4)))"), "(3+4)", "Multiple Brackets");
tests.add(p.parse("3\\cdot ( 4 + 5) "), "3*(4+5)", "Spaces in brackets");
tests.add(p.parse("3\\cdot 2 - ( 4 + 5) "), "3*2-(4+5)", "Spaces in brackets with plus minus");
tests.add(p.parse("((3 + 2) \\cdot 3) + (2  \\cdot 2\\cdot 3+ 2)\\cdot 3+2"), "((3+2)*3)+(2*2*3+2)*3+2", "Brackets at beginning");
tests.add(p.parse("3,5 + 3.2\\cdot2,6"), "3.5+3.2*2.6", "Replace \",\" with \".\"");
tests.add(p.parse("\\sin x"), "Math.sin(x)", "Parse sin with one argument without brackets");
tests.add(p.parse("\\tan x"), "Math.tan(x)", "Parse tan with one argument without brackets");
tests.add(p.parse("  \\sin\\  x "), "Math.sin(x)", "Parse sin with extra space");
tests.add(p.parse("\\sin (2+x)"), "Math.sin(2+x)", "Parse sin with one argument with brackets");
tests.add(p.parse("\\cos\\left(2-5\\cdot x\\right)"), "Math.cos(2-5*x)", "Parse cos with brackets");
tests.add(p.parse("2 + 3\\cdot \\cos\\left(2-5\\cdot x\\right)"), "2+3*Math.cos(2-5*x)", "Parse cos with brackets with addition and multiplication");
tests.add(p.parse("3+\\operatorname{cotanh}\\left(x\\right)"), "3+1/Math.tanh(x)", "Parse cotanh");
tests.add(p.parse("\\sin(x)^2"), "Math.pow(Math.sin(x),2)", "Power of sin function with brackets");
tests.add(p.parse("\\sin(x)^{22}"), "Math.pow(Math.sin(x),22)", "Multididgit power of sin function with brackets");
tests.add(p.parse("\\sin(x)^{2+2}"), "Math.pow(Math.sin(x),2+2)", "Multididgit power with addition of sin function with brackets");
tests.add(p.parse("\\sin x^2"), "Math.pow(Math.sin(x),2)", "Power of sin function without brackets");
tests.add(p.parse("\\sin x^{22}"), "Math.pow(Math.sin(x),22)", "Multididgit power of sin function without brackets");
tests.add(p.parse("\\sin x^{2+2}"), "Math.pow(Math.sin(x),2+2)", "Multididgit power with addition of sin function without brackets");
tests.add(p.parse("\\tanh(x)^2"), "Math.pow(Math.tanh(x),2)", "Power of tanh function with brackets");
tests.add(p.parse("\\tanh(x)^{22}"), "Math.pow(Math.tanh(x),22)", "Multididgit power of tanh function with brackets");
tests.add(p.parse("\\tanh(x)^{2+2}"), "Math.pow(Math.tanh(x),2+2)", "Multididgit power with addition of tanh function with brackets");
tests.add(p.parse("\\tanhx^2"), "Math.pow(Math.tanh(x),2)", "Power of tanh function without brackets");
tests.add(p.parse("\\tanh x^{22}"), "Math.pow(Math.tanh(x),22)", "Multididgit power of tanh function without brackets");
tests.add(p.parse("\\operatorname{cotan}( x)^{2}+   \\tanx  \\sinx  3"), "Math.pow(1/Math.tan(x),2)+Math.tan(x)*Math.sin(x)*3", "Test power and function multiplying without brackets")
tests.add(p.parse("\\tanh x^{2+2}"), "Math.pow(Math.tanh(x),2+2)", "Multididgit power with addition of tanh function without brackets");
tests.add(p.parse("2\\cdot\\tanh(x)^2+5\\cdot\\sinh(x+2\\cdot\\cos(x-2))^{2+\\sin(x)}"), "2*Math.pow(Math.tanh(x),2)+5*Math.pow(Math.sinh(x+2*Math.cos(x-2)),2+Math.sin(x))", "Some throw together fuction");
tests.add(p.parse("2 \\cdot \\sin(x)\\cos(x)x"), "2*Math.sin(x)*Math.cos(x)*x", "Multiplication with consecutive Functions");
tests.add(p.parse("\\sin(2)^33"), "Math.pow(Math.sin(2),3)*3", "Sin function with exponent and product after");
tests.add(p.parse("\\tan(x)\\sin(2)^{3-2}3"), "Math.tan(x)*Math.pow(Math.sin(2),3-2)*3", "Sin function with exponent in brackets and product after");
tests.add(p.parse("\\sin(2)^{3-2}\\sin3^2-3\\cdot\\sin(\\tanh(x)^{\\cos 4}+2)-2"), "Math.pow(Math.sin(2),3-2)*Math.pow(Math.sin(3),2)-3*Math.sin(Math.pow(Math.tanh(x),Math.cos(4))+2)-2", "Some more function power and product exploration");
tests.add(p.parse("2^3"), "Math.pow(2,3)", "Parse single numbers with power");
tests.add(p.parse("2\\sin(x)"), "2*Math.sin(x)", "Parse single numbers with hidden multiplication");
tests.add(p.parse("222.43 + 244 \\sin( 2 x )^ 3 2 \\cos 4"), "222.43+244*Math.pow(Math.sin(2*x),3)*2*Math.cos(4)", "Some factor multiplication with single numbers");
tests.add(p.parse("xx+x2x-x\\sin(x+2)"), "x*x+x*2*x-x*Math.sin(x+2)", "Parse x with hidden multiply");
tests.add(p.parse("xxxxx"), "x*x*x*x*x", "Parse chain of x");
tests.add(p.parse("xxx2xxxx+3,2\\cdot 3x2"), "x*x*x*2*x*x*x*x+3.2*3*x*2", "Parse string with facter consisting of multiple x in a chain");
tests.add(p.parse("(3)2"), "(3)*2", "Term in brackets times number");
tests.add(p.parse("(32343)2"), "(32343)*2", "Multiple digits in brackets times number");
tests.add(p.parse("(32\\sin(x))(3\\cdot\\sin(3x))"), "(32*Math.sin(x))*(3*Math.sin(3*x))", "Multiple digits in brackets times brackets");
tests.add(p.parse("\\frac{3}{1}"), "(3)/(1)", "Parse fractions with one term each");
tests.add(p.parse("\\frac{3\\sinx}{\\cos(x+2)}"), "(3*Math.sin(x))/(Math.cos(x+2))", "Parse fractions with multiple terms each");
tests.add(p.parse("2\\frac{2}{3}\\sin(x)"), "2*(2)/(3)*Math.sin(x)", "Brackets with factor after");
tests.add(p.parse("2\\frac{2+5}{3-3\\cdot3}\\sin(x)"), "2*(2+5)/(3-3*3)*Math.sin(x)", "Brackets with multiple digits with factor after");
tests.add(p.parse("(4+6)^2"), "Math.pow(4+6,2)", "Power with brackets");
tests.add(p.parse("2(3-2)^24"),"2*Math.pow(3-2,2)*4", "Brackets with singledigit power and factor after");
tests.add(p.parse("(4+6)^{23}"), "Math.pow(4+6,23)", "Multidigit power with brackets");
tests.add(p.parse("3(4+6)^{23}2x"), "3*Math.pow(4+6,23)*2*x", "Multidigit power with brackets and multiplication after");
tests.add(p.parse("4\\sinx+(2+4-3)^32x+2"), "4*Math.sin(x)+Math.pow(2+4-3,3)*2*x+2", "Singledidgit power with brackets");
tests.add(p.parse("3\\frac{2+4}{4-1}^3"), "3*Math.pow((2+4)/(4-1),3)", "Fraction with singledidgit power");
tests.add(p.parse("3\\frac{2+4}{4-1}^{3+2}"), "3*Math.pow((2+4)/(4-1),3+2)", "Fraction with multididgit power");
tests.add(p.parse("3\\frac{2+4}{4-1}^34"), "3*Math.pow((2+4)/(4-1),3)*4", "Fraction with singledidgit power and multiplication");
tests.add(p.parse("3\\frac{2+4}{4-1}^{3+4}4"), "3*Math.pow((2+4)/(4-1),3+4)*4", "Fraction with multididgit power and multiplication");
tests.add(p.parse("\\frac{3x}{2}+\\sin x\\cos x^{3+1}-\\frac{x}{\\sin\\left(x\\right)^2}"), "(3*x)/(2)+Math.sin(x)*Math.pow(Math.cos(x),3+1)-(x)/(Math.pow(Math.sin(x),2))", "Some random term");
tests.add(p.parse("a"), false, "New variable -> false");
tests.add(p.parse("sin"), false, "Wrong function -> false");
tests.add(p.parse("\\"), false, "Backslash -> false");
tests.add(p.parse("3x&§$"), false, "More sonderzeichen");
tests.add(p.parse("3+"), false, "Empty Node");
tests.add(p.parse("*"), false, "Just multiplication sign");
tests.add(p.parse("\\cdot"), false, "Multiplication \"\\cdot\"");
tests.add(p.parse("x(3a)"), false, "Some more errors");
tests.add(p.parse("()"), false, "Some more errors");
tests.add(p.parse("("), false, "Some more errors");
tests.add(p.parse(" x((fsdfl)+asd"), false, "Brackets do not even out");
tests.add(p.parse(" x((fsdfl)+a(s))d)"), false, "Brackets do not even out");
tests.add(p.parse("-3"), "(0-1)*3", "Negative Numbers");
tests.add(p.parse("+3"), "(0+1)*3", "Positive Numbers");
tests.add(p.parse("-20\\cdot 3"), "(0-1)*20*3", "A negative times something");
tests.add(p.parse("-\\sin(x)\\cdot\\frac{-3x}{-3}"), "(0-1)*Math.sin(x)*((0-1)*3*x)/((0-1)*3)", "Signs with functions and fractions")
tests.add(p.parse("3x+5"), "3*x+5", "Parse after wrong input");
tests.add(p.parse("3\\cdot+1"), "3*(0+1)*1", "Chain multiplication, addition");
tests.add(p.parse("3**2"), false, "Chain multiplication");
tests.add(p.parse("3+-1"), "3+(0-1)*1", "Chain addition and subtraction");
tests.add(p.parse("3-+1"), "3-(0+1)*1", "Chain subtraction and addition");
tests.add(p.parse("3-+++---+-+-1"), "3-(0+1)*(0+1)*(0+1)*(0-1)*(0-1)*(0-1)*(0+1)*(0-1)*(0+1)*(0-1)*1", "Chain subtraction and addition multiple times");
tests.add(p.parse("3\\cdot-+-2"), "3*(0-1)*(0+1)*(0-1)*2", "Multiplication with chain addition, subtraction");
tests.add(p.parse("-"), false, "Single minus");
tests.add(p.parse("+-"), false, "Plus with minus");
tests.add(p.parse("+-"), false, "Minus with plus");
tests.add(p.parse("\\tan"), false, "Function without argument");
tests.add(p.parse("\\left|2+1\\right|"), "Math.abs(2+1)", "Absolute value");
tests.add(p.parse("\\left|2+1\\right|x"), "Math.abs(2+1)*x", "Absolute value with factor after");
tests.add(p.parse("\\left|2+1\\right|^4"), "Math.pow(Math.abs(2+1),4)", "Absolute value with power");
tests.add(p.parse("\\left|2+x\\right|^{43}"), "Math.pow(Math.abs(2+x),43)", "Absolute value with multidigit power");
tests.add(p.parse("\\left|2+1\\right|^443"), "Math.pow(Math.abs(2+1),4)*43", "Absolute value with power and factor");
tests.add(p.parse("\\left|2+x\\right|^{43}\\left|2+1\\right|"), "Math.pow(Math.abs(2+x),43)*Math.abs(2+1)", "Absolute value with multidigit power and factor");
tests.add(p.parse("3+\\left|2+1\\right|"), "3+Math.abs(2+1)", "Addition and absolute value");
tests.add(p.parse("3+\\left|2+1\\right|\\cdot3"), "3+Math.abs(2+1)*3", "Addition, mulitplication and absolute value");
tests.add(p.parse("\\sin\\left|2+1\\right|"), "Math.sin(Math.abs(2+1))", "Function of absolute value without brackets");
tests.add(p.parse("3+\\sin\\left|2+1\\right|\\cdot3"), "3+Math.sin(Math.abs(2+1))*3", "Sin of absolute value without brackets with addition and multiplication");
tests.add(p.parse("\\sin\\left|2+1\\right|4"), "Math.sin(Math.abs(2+1))*4", "Sin of absolute value with factor after");
tests.add(p.parse("\\sin\\left|2+1\\right|^4"), "Math.pow(Math.sin(Math.abs(2+1)),4)", "Sin of absolute value with singledigit power");
tests.add(p.parse("\\sin\\left|2+1\\right|^{4-2}"), "Math.pow(Math.sin(Math.abs(2+1)),4-2)", "Sin of absolute value with multidigit power");
tests.add(p.parse("\\sin\\left|2+1\\right|^{4-2}3"), "Math.pow(Math.sin(Math.abs(2+1)),4-2)*3", "Sin of absolute value with multidigit power and factor after");
tests.add(p.parse("\\min\\left(x;2\\right)"), "Math.min(x,2)", "Minimum of 2 values");
tests.add(p.parse("\\min\\left(x;2;3\\right)"), "Math.min(x,2,3)", "Minimum of 3 values");
tests.add(p.parse("\\min()"), false, "Min just with brackets");
tests.add(p.parse("\\min"), false, "Min without brackets");
tests.add(p.parse("\\max\\left(x;2\\right)"), "Math.max(x,2)", "Maximum of 2 values");
tests.add(p.parse("\\max\\left(x;2;3\\right)"), "Math.max(x,2,3)", "Maximum of 3 values");
tests.add(p.parse("\\max()"), false, "Max just with brackets");
tests.add(p.parse("\\max"), false, "Max without brackets");
tests.add(p.parse("\\min(2x)2x\\min(3)^3"), "Math.min(2*x)*2*x*Math.pow(Math.min(3),3)", "Minimum with factor and power")
tests.add(p.parse("\\min3"), false, "Min with value without brackets");
tests.add(p.parse("\\min\\left|2+x\\right|"), false, "Minimum of absolute value");
tests.add(p.parse("\\min(3)"), "Math.min(3)", "Minimum of single value");
tests.add(p.parse("\\pi"), "Math.PI", "Parse pi");
tests.add(p.parse("e"), "Math.E", "Parse e");
tests.add(p.parse("\\pi\\pi\\pi"), "Math.PI*Math.PI*Math.PI", "Multiples PI's");
tests.add(p.parse("3x2"), "3*x*2", "x with factors without \\cdot")
tests.add(p.parse("3\\pi2"), "3*Math.PI*2", "Pi with factors without \\cdot");
tests.add(p.parse("3\\piee\\pixx"), "3*Math.PI*Math.E*Math.E*Math.PI*x*x", "Multiply x, e, pi");
tests.add(p.parse("\\pi^2"), "Math.pow(Math.PI,2)", "Pi with a singledigit power");
tests.add(p.parse("\\pi^{23}"), "Math.pow(Math.PI,23)", "Pi with a multidigit power");
tests.add(p.parse("\\pi^x3"), "Math.pow(Math.PI,x)*3", "Pi with a singledigit power and factor after");
tests.add(p.parse("\\pi^{23}3"), "Math.pow(Math.PI,23)*3", "Pi with a multidigit power and factor after");
tests.add(p.parse("eee2e"), "Math.E*Math.E*Math.E*2*Math.E", "Multiple E's");
tests.add(p.parse("\\operatorname{floor}(x)"), "Math.floor(x)", "Floor function");
tests.add(p.parse("\\operatorname{ceil}(x)"), "Math.ceil(x)", "Ceil function");
tests.add(p.parse("\\sqrt{23}"), "Math.sqrt(23)", "Squareroot");
tests.add(p.parse("\\sqrt{23}^3"), "Math.pow(Math.sqrt(23),3)", "Squareroot with power");
tests.add(p.parse("\\sqrt{23}^{23}"), "Math.pow(Math.sqrt(23),23)", "Squareroot with power");
tests.add(p.parse("\\sqrt{23}^{23}23"), "Math.pow(Math.sqrt(23),23)*23", "Squareroot with power and factor after");
tests.add(p.parse("\\sqrt[3]{2}"), "Math.pow(2,1/(3))", "Nthroot");
tests.add(p.parse("\\sqrt[3]{2}^134"), "Math.pow(Math.pow(2,1/(3)),1)*34", "Nthroot with power");
tests.add(p.parse("\\sqrt[3]{2}134"), "Math.pow(2,1/(3))*134", "Nthroot with factor");
tests.add(p.parse("\\sqrt[\\sqrt[3]{2}]{2}134"), "Math.pow(2,1/(Math.pow(2,1/(3))))*134", "Nthroot with nested n");
tests.add(p.parse("\\sqrt[\\sqrt[3]{\\sqrt[3]{2}}]{2}134"), "Math.pow(2,1/(Math.pow(Math.pow(2,1/(3)),1/(3))))*134", "Nthroot with nested D");
tests.add(p.parse("\\sqrt"), false, "Sqrt with no arguments");
tests.add(p.parse("\\sqrt[3+2]{4+5}+2"), "Math.pow(4+5,1/(3+2))+2", "Addition in square brackets");
tests.add(p.parse("\\sqrt[]"), false, "Nthroot with no arguments");
tests.add(p.parse("\\sqrt[3]"), false, "Nthroot with only one argument");
tests.add(p.parse("\\lnx"), "Math.log(x)", "NaturalA logarithm");
tests.add(p.parse("\\logx"), "Math.log(x)", "NaturalB logarithm");
tests.add(p.parse("\\lgx"), "Math.log10(x)", "Dekadischer Logarithmus");
tests.add(p.parse("\\operatorname{lb}x"), "Math.log2(x)", "Binärer Logarithmus");
tests.add(p.parse("\\operatorname{lb}"), false, "Invalid lb argument");
tests.add(p.parse("\\log_23"), "Math.log(3)/Math.log(2)", "Log with singledigit base, singledigit argument");
tests.add(p.parse("\\log_{24}3"), "Math.log(3)/Math.log(24)", "Log with multidigit base, singledigit argument");
tests.add(p.parse("\\log_2(33)"), "Math.log(33)/Math.log(2)", "Log with singleigit base, multidigit argument");
tests.add(p.parse("\\log_{24}(33)"), "Math.log(33)/Math.log(24)", "Log with multidigit base, multidigit argument");
tests.add(p.parse("\\log_23^3"), "Math.pow(Math.log(3)/Math.log(2),3)", "Power after log");
tests.add(p.parse("\\log_233"), "Math.log(3)/Math.log(2)*3", "Factor after log");
tests.add(p.parse("\\log_{2+3}(4+2)+3-2\\cdot3"), "Math.log(4+2)/Math.log(2+3)+3-2*3", "Addition in logn");
tests.add(p.parse("\\log_{ }"), false, "Log without arguments");
tests.add(p.parse("\\log_+"), false, "Log with + als Basis");
tests.add(p.parse("00"), "0", "Multiple 0 to one");
tests.add(p.parse("300"), "300", "Keep multiple 0 in 300");
tests.add(p.parse("2+.3"), "2+0.3", "Parse .3");
tests.add(p.parse("."), false, "Don't parse .");
tests.add(p.parse("2+."), false, "Don't parse 2+.");
tests.add(p.parse(".3"), "0.3", "Parse .3");
tests.add(p.parse("x^-"), false, "Power of sign");

tests.testAll();

/*
35 liegestütze ;D
30 situps ;D
1:30 plank
*/