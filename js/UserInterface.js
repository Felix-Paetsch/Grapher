class UserInterface{
    constructor(){
        this.NewFB = document.getElementById("AddNewFunctionButton");
        this.GO = Grapher;
        this.functionCount = 0;
        this.colorCount = 0;
        this.colors = [
            "blue",
            "#E15554",
            "#E1BC29",
            "#3BB273",
            "#4D9DE0",
            "#B26700",
            "#7768AE"
        ];
        this.pointscolorCount = 0;
        this.pointscolors = this.colors;
        this.initFirstFunctionBox();
        this.initFirstPointBox();
        this.addGridOptions();
        this.GO.draw();
    }

    createScaleObj(xbeginspan, ybeginspan, xscalespan, yscalespan){
        var inputFieldX = MQ.MathField(xbeginspan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(inputFieldX.latex())) inputFieldX.latex(replaceLatex(replaceLatex(inputFieldX.latex())))
                    else Grapher.updateGridSetting(5, inputFieldX.latex());
                }
            }
        });

        var inputFieldY = MQ.MathField(ybeginspan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(inputFieldY.latex())) inputFieldY.latex(replaceLatex(replaceLatex(inputFieldY.latex())))
                    else Grapher.updateGridSetting(6, inputFieldY.latex());
                }
            }
        });

        var ScaleX = MQ.MathField(xscalespan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(ScaleX.latex())) ScaleX.latex(replaceLatex(replaceLatex(ScaleX.latex())))
                    else Grapher.updateGridSetting(3, ScaleX.latex());
                }
            }
        });

        var ScaleY = MQ.MathField(yscalespan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(ScaleY.latex())) ScaleY.latex(replaceLatex(replaceLatex(ScaleY.latex())))
                    else Grapher.updateGridSetting(4, ScaleY.latex());
                }
            }
        });
        
        this.MObj = new MouseEventObj(inputFieldX, inputFieldY, ScaleX, ScaleY);
    }

    initFirstFunctionBox(){
        this.addLatexToFunction(document.getElementsByClassName("functionInputBox")[0]);
        this.addEventsForFunctionBox(document.getElementById("functionContainer").children[0]);
        this.ajouterFonctionTableauDeValeursEve(document.getElementsByClassName("funcWertetabelle")[0]);
        this.addEventListenerForWTPoints(document.getElementsByClassName("funcWertetabelle")[0]);
        this.GO.functions[0].wtPoints[0][1] = "1";
    }

    initFirstPointBox(){
        var p = document.getElementById("pointsContainer").getElementsByClassName("pointBox")[0];
        this.addPointBoxMouseEventListener(p);
        this.addStaticMathForPoints(p);
        this.addPointsXYevents(p);
        this.addPointsCheckboxEvents(p);
        this.addOnTextInputEvent(p);
    }

    addPointsCheckboxEvents(p){
        var cbel = p.getElementsByClassName("uicheckbox");
        for (var i = 0; i < cbel.length; i++){
            cbel[i].addEventListener("click", (f) => {
                var t = f.target;
                var i = 0;
                while (!f.target.classList.contains("uicheckbox") && i < 5){
                    i++;
                    t = f.target.parentNode;
                }
                var ca = p.parentNode.getElementsByClassName("pointBox");
                for (var i = 0; i < ca.length; i++) if (p === ca[i]) break;
                t.firstElementChild.classList.toggle("active");
                if (t.classList.contains("pvisible"))
                    this.GO.points[i].visible = !this.GO.points[i].visible
                else if (t.classList.contains("cvisible"))
                    this.GO.points[i].pvis = !this.GO.points[i].pvis
                else if (t.classList.contains("nvisible"))
                    this.GO.points[i].nvis = !this.GO.points[i].nvis;
                this.GO.draw();
            })
        }
    }

    addGridOptions(){
        this.gridUI = document.getElementById("gridSettingsContainer");
        this.addAxisNameInput();
        this.addGridLeftSideCheckBoxEvents();
        this.addGridRightSideInputBoxes();
    }

    addGridRightSideInputBoxes(){
        var ca = document.getElementById("gridCSSgrid").getElementsByClassName("gridR");
        for (var i = 0; i < ca.length - 4; i++){
            this.addSingleMQBoxToGridRS(ca[i], i);
        }
        this.createScaleObj(ca[i+2], ca[i+3], ca[i], ca[i+1]);
    }

    addSingleMQBoxToGridRS(el, i){
        var inputField = MQ.MathField(el, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else Grapher.updateGridSetting(i, inputField.latex());
                }
            }
        });
    }

    addAxisNameInput(){
        document.getElementById("xaxisname").firstElementChild.addEventListener("input", (e) => {
            this.GO.grid.xname = decodeURIComponent(e.target.textContent);
            this.GO.draw();
        });
        document.getElementById("yaxisname").firstElementChild.addEventListener("input", (e) => {
            this.GO.grid.yname = decodeURIComponent(e.target.textContent);
            this.GO.draw();
        });
    }

    addGridLeftSideCheckBoxEvents(){
        document.getElementById("gridSl").getElementsByClassName("uicheckbox")[0].addEventListener("click", (e) => {
            document.getElementById("gridSl").getElementsByClassName("uicheckbox")[0].firstElementChild.classList.toggle("active");
            this.GO.grid.AxisNames = !this.GO.grid.AxisNames;
            this.GO.draw();
        });
        document.getElementById("gridSl").getElementsByClassName("uicheckbox")[1].addEventListener("click", (e) => {
            document.getElementById("gridSl").getElementsByClassName("uicheckbox")[1].firstElementChild.classList.toggle("active");
            this.GO.grid.Arrows = !this.GO.grid.Arrows;
            this.GO.draw();
        });
    }

    addOnTextInputEvent(p){
        p.getElementsByClassName("PnameTextfield")[0].addEventListener("input", (e) => {
            var ca = p.parentNode.getElementsByClassName("pointBox");
            for (var i = 0; i < ca.length; i++) if (p === ca[i]) break;
            this.GO.points[i].name = decodeURIComponent(e.target.textContent);
            this.GO.draw();
        });
    }

    addStaticMathForPoints(p){
        MQ.StaticMath(p.getElementsByClassName("pointCoordinatesInputA")[0]);
        MQ.StaticMath(p.getElementsByClassName("pointCoordinatesInputB")[0]);
        MQ.StaticMath(p.getElementsByClassName("pointCoordinatesInputC")[0]);
    }

    addPointsXYevents(p){
        var xspan = p.getElementsByClassName("pointInputLeft")[0];
        var inputField = MQ.MathField(xspan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else {
                        var ca = document.getElementById("pointsContainer").children;
                        for (var i = 0; i < ca.length; i++) if (ca[i] === xspan.parentNode.parentNode.parentNode) break;
                        Grapher.updatePoint(i, true, inputField.latex());
                        if (Grapher.points[i].valX && Grapher.points[i].valY)
                            xspan.parentNode.parentNode.getElementsByClassName("warning")[0].style.display = "none"
                        else xspan.parentNode.parentNode.getElementsByClassName("warning")[0].style.display = "initial";
                    }
                }
            }
        });

        var yspan = p.getElementsByClassName("pointInputRight")[0];
        var inputField2 = MQ.MathField(yspan, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else {
                        var ca = document.getElementById("pointsContainer").children;
                        for (var i = 0; i < ca.length; i++) if (ca[i] === xspan.parentNode.parentNode.parentNode) break;
                        Grapher.updatePoint(i, false, inputField2.latex());
                        if (Grapher.points[i].valX && Grapher.points[i].valY)
                            xspan.parentNode.parentNode.getElementsByClassName("warning")[0].style.display = "none"
                        else xspan.parentNode.parentNode.getElementsByClassName("warning")[0].style.display = "initial";
                    }
                }
            }
        });
    }

    addPointBoxMouseEventListener(p){
        p.addEventListener("mouseenter", (k) => {
            var elements = k.target.getElementsByClassName("USInput");
            for (var i = 0; i < elements.length; i++) elements[i].style.display = "inherit";
        });
        p.addEventListener("mouseleave", (k) => {
            var elements = k.target.getElementsByClassName("USInput");
            for (var i = 0; i < elements.length; i++) elements[i].style.display = "none";
        });
    }

    PunkteClicked(el){
        if (!el.classList.contains("nactive")) return;
        document.getElementById("tilteFunktionen").classList.add("nactive");
        document.getElementById("titleCosys").classList.add("nactive");
        el.classList.remove("nactive");
        document.getElementById("functionContainer").style.display = "none";
        document.getElementById("pointsContainer").style.display = "initial";
        document.getElementById("gridSettingsContainer").style.display = "none";
        document.getElementById("bigboxtitleline").style.backgroundColor = "rgba(46,156,202, 1)";
    }

    FunktionenClicked(el){
        if (!el.classList.contains("nactive")) return;
        document.getElementById("titlePoints").classList.add("nactive");
        document.getElementById("titleCosys").classList.add("nactive");
        el.classList.remove("nactive");
        document.getElementById("functionContainer").style.display = "initial";
        document.getElementById("pointsContainer").style.display = "none";
        document.getElementById("gridSettingsContainer").style.display = "none";
        document.getElementById("bigboxtitleline").style.backgroundColor = "rgba(20,160,152,1)";
    }

    fcolorboxclicked(el){
        var ca = el.parentNode.parentNode.parentNode.children;
        for (var i = 0; i < ca.length; i++) if (el.parentNode.parentNode === ca[i]) break;
        this.GO.functions[i].colorIndex = (this.GO.functions[i].colorIndex + 1)  % this.colors.length;
        this.GO.functions[i].color = this.colors[this.GO.functions[i].colorIndex];
        el.style.backgroundColor = this.colors[this.GO.functions[i].colorIndex];
        this.GO.draw();
    }

    pcolorboxclicked(el){
        var ca = el.parentNode.parentNode.parentNode.children;
        for (var i = 0; i < ca.length; i++) if (el.parentNode.parentNode === ca[i]) break;
        this.GO.points[i].colorIndex = (this.GO.points[i].colorIndex + 1)  % this.pointscolors.length;
        this.GO.points[i].color = this.pointscolors[this.GO.points[i].colorIndex];
        el.style.backgroundColor = this.pointscolors[this.GO.points[i].colorIndex];
        this.GO.draw();
    }

    CoSysClicked(el){
        if (!el.classList.contains("nactive")) return;
        document.getElementById("functionContainer").style.display = "none";
        document.getElementById("pointsContainer").style.display = "none";
        document.getElementById("gridSettingsContainer").style.display = "initial";
        document.getElementById("titlePoints").classList.add("nactive");
        document.getElementById("tilteFunktionen").classList.add("nactive");
        el.classList.remove("nactive");
        document.getElementById("bigboxtitleline").style.backgroundColor = "#5BC0BE";
    }

    removePoint(el){
        var ca = el.parentNode.parentNode.parentNode.children;
        for (var i = 0; i < ca.length; i++) if (el.parentNode.parentNode === ca[i]) break;
        el.parentNode.parentNode.remove();
        this.GO.points.splice(i, 1);
        this.GO.draw();
    }

    pushNewPoint(el){
        el.insertAdjacentHTML("beforebegin", '<div class="pointBox"><div class="firstrow"><span class="colorbox" onclick="UI.pcolorboxclicked(this)">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="pointInputBox"><span class="pointCoordinatesInputA">P(</span><span class="pointInputLeft"></span><span class="pointCoordinatesInputB">;</span><span class="pointInputRight"></span><span class="pointCoordinatesInputC">)</span></span><div class="removepoint" onclick="UI.removePoint(this)">x</div><div class="warning">&#x26a0;</div></div><div class="USInput" style="display: none;"><div class="USIflex"><div class="leftcheckbox"><div class="uicheckbox pvisible"><div class="cb active"></div><div class="cblabel">Punkt anzeigen</div></div><div class="uicheckbox cvisible"><div class="cb active"></div><div class="cblabel">Kreis anzeigen</div></div><div class="uicheckbox nvisible"><div class="cb active"></div><div class="cblabel">Namen anzeigen</div></div></div><div class="rightComp"><div class="pointTitle">Name</div><div class="CompFlex"><span class="PnameTextfield mq-editable-field" contenteditable="true" spellcheck="false" autocapitalize="false"></span></div></div></div></div></div>');

        var pc = document.getElementById("pointsContainer").getElementsByClassName("pointBox");
        var p = pc[pc.length - 1];
        this.pointscolorCount = (this.pointscolorCount + 1)  % this.pointscolors.length;
        p.getElementsByClassName("colorbox")[0].style.backgroundColor = this.pointscolors[this.pointscolorCount];
        this.GO.points.push({
            name: "",
            color: this.pointscolors[this.pointscolorCount],
            colorIndex: this.pointscolorCount,
            radius: 4,
            posX: 0,
            posY: 0,
            fontsize: 18,
            visible: true,
            valX : false,
            valY : false,
            pvis : true,
            nvis : true
        });
        this.addPointBoxMouseEventListener(p);
        this.addStaticMathForPoints(p);
        this.addPointsXYevents(p);
        this.addPointsCheckboxEvents(p);
        this.addOnTextInputEvent(p);
        this.GO.draw();
    }

    ajouterFonctionTableauDeValeursEve(el){
        MQ.StaticMath(el.getElementsByClassName("mostleft")[0]),
        MQ.StaticMath(el.getElementsByClassName("mostleft")[1]);
    }

    elargirFonctionPointTableau(el){
        var mr = el.getElementsByClassName("mostright");
        mr[0].insertAdjacentHTML("beforebegin", '<div class="row1 pointRow1"><div></div></div>');
        mr[1].insertAdjacentHTML("beforebegin", '<div class="row2 pointRow2">-</div>');
        mr[2].insertAdjacentHTML("beforebegin", '<div class="row3 pointRow3">x</div>');
        this.addEventListenerForWTPoints(el);
    }

    addEventListenerForWTPoints(el){
        var ceR1 = el.getElementsByClassName("pointRow1");
        var newPin = ceR1[ceR1.length-1];
        var newPout = MQ.StaticMath(el.getElementsByClassName("pointRow2")[ceR1.length-1]);
        var ca = document.getElementById("functionContainer").children;

        for (var i = 0; i < ca.length; i++) if (ca[i] === newPin.parentNode.parentNode.parentNode.parentNode) break;
        Grapher.functions[i].wtPoints.push([newPout, ""]);
        var inputField = MQ.MathField(newPin.firstElementChild, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    var ca = document.getElementById("functionContainer").children;
                    for (var i = 0; i < ca.length; i++) if (ca[i] === newPin.parentNode.parentNode.parentNode.parentNode) break;
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else {
                        var parsedResult = Grapher.Parser.parseNoX(inputField.latex());
                        var cb = newPin.parentNode.children;
                        for (var j = 0; j < cb.length; j++) if (cb[j] === newPin) break;
                        Grapher.functions[i].wtPoints[j-1][1] = [parsedResult];
                        Grapher.evalFunctionPoints(i);
                    }
                }
            }
        });
        var ceR2 = el.getElementsByClassName("pointRow3");
        ceR2[ceR2.length-1].addEventListener("click", (e) => {
            var ca = e.target.parentNode.getElementsByClassName("pointRow3");
            for (var j = 0; j < ca.length; j++) if (ca[j] === e.target) break;
            Grapher.functions[i].wtPoints.splice(j,1);
            e.target.parentNode.getElementsByClassName("pointRow1")[j].remove();
            e.target.parentNode.getElementsByClassName("pointRow2")[j].remove();
            e.target.parentNode.getElementsByClassName("pointRow3")[j].remove();
            Grapher.draw();
        })
    }

    addEventsForFunctionBox(el){
        el.getElementsByClassName("colorbox")[0].style.backgroundColor = this.colors[this.colorCount];
        MQ.StaticMath(el.getElementsByClassName("fvonxbox")[0]);
        el.addEventListener("mouseenter", (k) => {
            var elements = k.target.getElementsByClassName("USInput");
            for (var i = 0; i < elements.length; i++) elements[i].style.display = "inherit";
        });
        el.addEventListener("mouseleave", (k) => {
            var elements = k.target.getElementsByClassName("USInput");
            for (var i = 0; i < elements.length; i++) elements[i].style.display = "none";
        });
        var cbel = el.getElementsByClassName("uicheckbox");
        for (var i = 0; i < cbel.length; i++){
            cbel[i].addEventListener("click", (f) => {
                var t = f.target;
                var i = 0;
                while (!f.target.classList.contains("uicheckbox") && i < 5){
                    i++;
                    t = f.target.parentNode;
                }
                t.firstElementChild.classList.toggle("active");
                this.toggleGOonCheckbox(t);
            })
        }
        this.addLatexToIntervals(el);
    }

    addLatexToIntervals(el){
        var lbound = el.getElementsByClassName("lbound")[0];
        var inputField = MQ.MathField(lbound, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    var ca = document.getElementById("functionContainer").children;
                    for (var i = 0; i < ca.length; i++) if (ca[i] === lbound.parentNode.parentNode.parentNode.parentNode.parentNode) break;
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else Grapher.updateFunctionInterval(i, 0, inputField.latex());
                },
                mouseleave: function(){
                    //siehe mathquill.min.js
                    if (!Grapher.Parser.parseNoX(inputField.latex()))
                        inputField.latex("-\\infty");
                }
            }
        });
        
        var rbound = el.getElementsByClassName("rbound")[0];
        var inputField2 = MQ.MathField(rbound, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    var ca = document.getElementById("functionContainer").children;
                    for (var i = 0; i < ca.length; i++) if (ca[i] === rbound.parentNode.parentNode.parentNode.parentNode.parentNode) break;
                    if (checkForReplacementNeeded(inputField2.latex())) inputField2.latex(replaceLatex(replaceLatex(inputField2.latex())))
                    else Grapher.updateFunctionInterval(i, 1, inputField2.latex());
                },
                mouseleave: function(){
                    if (!Grapher.Parser.parseNoX(inputField2.latex()))
                        inputField2.latex("\\infty");
                }
            }
        });
        MQ.StaticMath(el.getElementsByClassName("tryoutspan")[0]);
    }

    toggleGOonCheckbox(el){
        var ca = document.getElementById("functionContainer").children;
        for (var i = 0; i < ca.length; i++) if (ca[i] === el.parentNode.parentNode.parentNode.parentNode) break;
        if (el.classList.contains("extrema"))
            this.GO.functions[i].showDerivZeros = !this.GO.functions[i].showDerivZeros
        else if (el.classList.contains("nullstellen"))
            this.GO.functions[i].showZeros = !this.GO.functions[i].showZeros
        else if (el.classList.contains("visible"))
            this.GO.functions[i].visible = !this.GO.functions[i].visible;
        this.GO.draw();
    }

    addLatexToFunction(el){
        var inputField = MQ.MathField(el, {
            autoOperatorNames: 'ln lb log lg sec csc coth sech csch sign sin cos cosh sinh tanh abs sin tan cos cot min max floor ceil arctan arctanh arcsinh arccosh exp arcsin arccos cosec',
            autoCommands: 'pi',
            handlers: {
                edit: function() {
                    var ca = document.getElementById("functionContainer").children;
                    for (var i = 0; i < ca.length; i++) if (ca[i] === el.parentNode.parentNode) break;
                    if (checkForReplacementNeeded(inputField.latex())) inputField.latex(replaceLatex(replaceLatex(inputField.latex())))
                    else {
                        Grapher.updateFunction(i, inputField.latex());
                        Grapher.evalFunctionPoints(i);
                    }
                    if(!Grapher.functions[i].valid){el.parentNode.getElementsByClassName("warning")[0].style.display = "initial";
                    } else {el.parentNode.getElementsByClassName("warning")[0].style.display = "none";}
                }
            }
        });
    }

    removeFunction(el){
        var ca = document.getElementById("functionContainer").children;
        for (var i = 0; i < ca.length; i++) if (ca[i] === el.parentNode.parentNode) break;
        el.parentNode.parentNode.remove();
        this.functionCount--;
        this.GO.functions.splice(i,1);
        this.GO.draw();
    }

    pushNewFunction(){
        this.NewFB.insertAdjacentHTML("beforebegin", '<div class="functionBox"> <div class="firstrow"> <span class="colorbox" onclick="UI.fcolorboxclicked(this)">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fvonxbox">y =&ensp;</span><span class="functionInputBox"></span> <div class="removefunction" onclick="UI.removeFunction(this)">x</div> <div class="warning">&#x26a0;</div> </div> <div class="USInput"><div class="USIflex"><div class="leftcheckbox"><div class="uicheckbox visible"> <div class="cb active"></div> <div class="cblabel">Funktion anzeigen</div> </div> <div class="uicheckbox nullstellen"> <div class="cb"></div> <div class="cblabel">Nullstellen anzeigen</div> </div> <div class="uicheckbox extrema"> <div class="cb"></div> <div class="cblabel">Extrema anzeigen</div></div></div><div class="rightComp"><div class="intervalTitle">Definitionsbereich</div><div class="CompFlex"><span class="lbound intervalbound">-\\infinity</span><span class="tryoutspan">&lt;x&lt;</span><span class="rbound intervalbound">\\infinity</span></div></div></div><div class="funcWertetabelleWrapper"><div class="funcWertetabelle"><div class="row1 mostleft">x</div><div class="row1 mostright" onclick="UI.elargirFonctionPointTableau(this.parentNode)"></div><div class="row2 mostleft">f(x)</div><div class="row2 mostright" onclick="UI.elargirFonctionPointTableau(this.parentNode)"></div><div class="row3 mostleft"></div><div class="row3 mostright" onclick="UI.elargirFonctionPointTableau(this.parentNode)"></div></div></div></div></div>');
        this.functionCount++;
        this.addLatexToFunction(document.getElementsByClassName("functionInputBox")[this.functionCount], this.functionCount);
        this.colorCount = (this.colorCount + 1)  % this.colors.length;
        this.GO.functions.push({
            inputText: "",
            color: this.colors[this.colorCount],
            colorIndex: this.colorCount,
            thickness: 1.5,
            intervals: [[-Infinity, Infinity]],
            poles: [],
            visible: true,
            valid: false,
            zeros: [],
            derivZeros: [],
            showDerivZeros: false,
            showZeros: false,
            wtPoints: []
        });
        var FCElements = document.getElementById("functionContainer").children;
        var el = FCElements[FCElements.length-2];
        this.addEventsForFunctionBox(el);
        this.ajouterFonctionTableauDeValeursEve(el.getElementsByClassName("funcWertetabelle")[0]);
    }
}