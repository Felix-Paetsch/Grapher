class GraphObj{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.Parser = new Parser();
        this.drawEnabled = true;
        this.grid = {
            GridSpace: 40,
            OriginX: 3,
            oxInput: -3,
            OriginY: 3.5,
            oyInput: -4,
            dx: .1,
            ScaleX: 1,
            ScaleY: 1,
            xname: 'x',
            yname: 'y',
            tfontsize: 14,
            axisfonzsize: 16,
            Arrows: true,
            Grid: true,
            Axis: true,
            AxisNames: true,
            Makierungen: true

        };
        this.functions = [{
            inputText: "\\sin(x)",
            color: "blue",
            colorIndex: 0,
            thickness: 1.5,
            intervals: [[-Infinity, Infinity]],
            poles: [],
            visible: true,
            valid: true,
            zeros: [],
            derivZeros: [],
            showDerivZeros: false,
            showZeros: true,
            wtPoints: []
        }];
        this.points = [{
            name: "f(x) = sin(x)",
            color: "blue",
            colorIndex: 0,
            radius: 4,
            posX: 2,
            posY: 2,
            fontsize: 18,
            visible: true,
            valX : true,
            valY : true,
            pvis : false,
            nvis : true
        }];
        this.parseFunc(0);

        this.draw();
    }

    draw(){
        if (!this.drawEnabled) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.grid.GridSpace*this.grid.OriginX, this.grid.GridSpace*this.grid.OriginY);
        
        this.drawGrid();
        this.drawFunctions();
        this.tickmarkAxis();
        if (this.grid.Arrows && this.grid.Axis) this.drawArrows();
        this.WriteAxisNames();
        this.drawPoints();
        this.drawFunctionPoints();
        this.drawWTfunctionPoints();
        this.ctx.translate(-this.grid.GridSpace*this.grid.OriginX, -this.grid.GridSpace*this.grid.OriginY);
        this.drawUmfang();
    }

    drawWTfunctionPoints(){
        for (var i = 0; i < this.functions.length; i++){
            if (this.functions[i].visible && this.functions[i].valid){
                for (var j = 0; j < this.functions[i].wtPoints.length; j++){
                    if (this.IsContainedInInterval(eval(this.functions[i].wtPoints[j][1].toString()), this.functions[i].intervals)){
                        this.ctx.beginPath();
                        this.ctx.arc(eval(this.functions[i].wtPoints[j][1].toString())*this.grid.GridSpace/this.grid.ScaleX+.5, -this.functions[i].func(eval(this.functions[i].wtPoints[j][1].toString()))*this.grid.GridSpace/this.grid.ScaleY+.5, 4, 0, 2 * Math.PI);
                        this.ctx.fillStyle = "grey";
                        this.ctx.fill();
                    }
                }
            }
        }
    }

    drawFunctionPoints(){
        this.functions.forEach(f => {
            if (f.visible && f.valid){
                if (f.showZeros) f.zeros.forEach(z => {
                    this.drawSinglePoint(z, f.func(z));
                });
                if (f.showDerivZeros) f.derivZeros.forEach(z => {
                    this.drawSinglePoint(z, f.func(z));
                });
            }
        });
    }

    drawSinglePoint(a, b){
        this.ctx.beginPath();
        this.ctx.arc(a*this.grid.GridSpace/this.grid.ScaleX+.5, -b*this.grid.GridSpace/this.grid.ScaleY+.5, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = "grey";
        this.ctx.fill();
    }

    updateGridSetting(i, expr){
        var val = eval(this.Parser.parseNoX(expr).toString());
        if (val) {
            switch (i){
                case 0:
                    this.canvas.width = val;
                    if (this.canvas.width > 600) {
                        document.getElementById("hg-logo").style.transform = "scale(.5, .5)";
                        document.getElementById("hg-logo").style.top = "-20px";
                    } else {
                        document.getElementById("hg-logo").style.transform = "";
                        document.getElementById("hg-logo").style.top = "20px";
                    }
                    break;
                case 1:
                    this.canvas.height = val;
                    break;
                case 2:
                    this.grid.GridSpace = val;
                    break;
                case 3:
                    this.grid.ScaleX = val;
                    break;
                case 4:
                    this.grid.ScaleY = val;
                    break;
                case 5:
                    this.grid.oxInput = val;
                    break;
                case 6:
                    this.grid.oyInput = val;
                    break;
            }
            this.evalNewOxOy();
            this.draw();
            document.getElementById("gridSettingsContainer").getElementsByClassName("gridW")[i].style.display = "none";
        } else if (val === 0 && i > 4){
            switch (i){
                case 5:
                    this.grid.oxInput = 0;
                    break;
                case 6:
                    this.grid.oyInput = 0;
                    break;
            }
            this.evalNewOxOy();
            this.draw();
        } else document.getElementById("gridSettingsContainer").getElementsByClassName("gridW")[i].style.display = "block";
    }

    evalNewOxOy(){
        this.grid.OriginX = - this.grid.oxInput / this.grid.ScaleX;
        this.grid.OriginY = this.canvas.height / this.grid.GridSpace + this.grid.oyInput / this.grid.ScaleY;
    }

    updateFunction(i, expr){
        this.functions[i].inputText = expr;
        this.parseFunc(i);
        this.draw();
    }

    updateFunctionInterval(i, minmax, expr){
        var parsedText = this.Parser.parseNoX(expr);
        if (parsedText === false)
            this.functions[i].intervals[0][minmax] = minmax === 0 ? -Infinity : Infinity
        else this.functions[i].intervals[0][minmax] = eval(parsedText);
        this.evalFunctionPoints(i);
        this.draw();
    }

    updatePoint(i, isX, expr){
        var parsedText = this.Parser.parseNoX(expr);
        if (parsedText === false) {
            isX === true ? this.points[i].valX = false : this.points[i].valY = false;
        } else {
            if(isX === true){
                this.points[i].valX = true;
                this.points[i].posX = eval(parsedText.toString())
            }
            else {
                this.points[i].valY = true;
                this.points[i].posY = eval(parsedText.toString());
            }
        }
        this.draw();
    }

    parseFunc(findex){
        var parsedText = this.Parser.parse(this.functions[findex].inputText);
        if (parsedText === false){
            this.functions[findex].valid = false;
            return;
        }
        this.functions[findex].valid = true;
        this.functions[findex].func = eval("(x) => {return " + parsedText + ";}");
    }

    WriteAxisNames(){
        if(!this.grid.AxisNames || !this.grid.Axis) return;
        this.ctx.fillStyle = "#000000";
        this.ctx.font = this.grid.axisfonzsize + "px Symbola"; //Arial
        this.ctx.fillText(this.grid.xname, this.canvas.width - this.grid.GridSpace*this.grid.OriginX - this.ctx.measureText(this.grid.xname).width - 8, 10 -this.grid.axisfonzsize);
        this.ctx.fillText(this.grid.yname, 5, -this.grid.OriginY*this.grid.GridSpace + 20);
    
    }

    tickmarkAxis(){
        if(!this.grid.Makierungen || !this.grid.Axis) return;
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = "#000000";
        this.ctx.font = this.grid.tfontsize + "px Symbola"; //Arial
        var t = "";
        for (var i = -Math.ceil(this.grid.OriginX); i < Math.ceil(this.canvas.width/this.grid.GridSpace-this.grid.OriginX); i++){
            this.ctx.beginPath();
            this.ctx.moveTo(i*this.grid.GridSpace+.5, 3);
            this.ctx.lineTo(i*this.grid.GridSpace+.5, -3);
            this.ctx.stroke();
            t = Math.round(i*this.grid.ScaleX*1000)/1000;
            this.ctx.fillText(t, i*this.grid.GridSpace-this.ctx.measureText((Math.round(i*this.grid.ScaleX*1000)/1000).toString()).width-3, 3+this.grid.tfontsize);
        }

        for (var i = -Math.ceil(this.grid.OriginY); i < Math.ceil(this.canvas.height/this.grid.GridSpace-this.grid.OriginY); i++){
            this.ctx.beginPath();
            this.ctx.moveTo(3,i*this.grid.GridSpace+.5);
            this.ctx.lineTo(-3, i*this.grid.GridSpace+.5);
            this.ctx.stroke();
            t = Math.round(-i*this.grid.ScaleY*1000)/1000;
            if (i != 0) this.ctx.fillText(t, -this.ctx.measureText((t).toString()).width-3, i*this.grid.GridSpace+3+this.grid.tfontsize);
        }
    }

    evalFunctionPoints(i){
        for (var j = 0; j < this.functions[i].wtPoints.length; j++){
            this.functions[i].wtPoints[j][0].latex(!((eval(this.functions[i].wtPoints[j][1].toString())||this.functions[i].wtPoints[j][1].toString() === "0") && this.functions[i].valid  && this.IsContainedInInterval(eval(this.functions[i].wtPoints[j][1].toString()), this.functions[i].intervals)) ? 
            "-" : Math.round(this.functions[i].func(eval(this.functions[i].wtPoints[j][1].toString()))*1000)/1000);
        }
        this.draw();
    }

    IsContainedInInterval(point, intervals){
        if (point == false && point !== 0) return false;
        for (var i = 0; i < intervals.length; i++){
            if(intervals[i][0]/this.grid.ScaleX <= point && point <= intervals[i][1]/this.grid.ScaleX) return true;
        }
        return false;
    }

    drawPoints(){
        this.points.forEach(p => {
            if (p.visible === false || p.valX === false || p.valY == false) return;
            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            if (p.pvis){
                this.ctx.arc(p.posX*this.grid.GridSpace/this.grid.ScaleX+.5, -p.posY*this.grid.GridSpace/this.grid.ScaleY+.5, p.radius, 0, 2 * Math.PI);
                this.ctx.fill();
            }

            if (!p.nvis) return;
            this.ctx.font = p.fontsize + "px Symbola";
            if (p.pvis)
                this.ctx.fillText(p.name, p.posX*this.grid.GridSpace/this.grid.ScaleX+4.5+p.radius, -p.posY*this.grid.GridSpace/this.grid.ScaleY+p.fontsize/2-1.5);
            else this.ctx.fillText(p.name, p.posX*this.grid.GridSpace/this.grid.ScaleX+4.5, -p.posY*this.grid.GridSpace/this.grid.ScaleY+p.fontsize/2-1.5);
        });
    }

    drawFunctions(){
        this.functions.forEach((f) => {
            if (!f.visible || !f.valid) return;
            f.derivZeros = [];
            f.zeros = [];
            this.ctx.strokeStyle = f.color;
            this.ctx.lineWidth = f.thickness;
            function CheckPoles(j, s){
                for (var k = 0; k < f.poles.length; k++) {
                    if ((f.poles[k] - (j-1)/s) * (f.poles[k] - j/s) <= 0) return true;
                }
                return false;
            }
            for (var k = 0; k < f.intervals.length; k++){
                f.zeros = [];
                f.derivZeros = [];

                var prevprev = -f.func(Math.max(-this.grid.OriginX,f.intervals[k][0])-.02)/this.grid.ScaleY*this.grid.GridSpace+.5;
                var prev = -f.func(Math.max(-this.grid.OriginX,f.intervals[k][0])-.01)/this.grid.ScaleY*this.grid.GridSpace+.5;
                var now = -f.func(Math.max(-this.grid.OriginX,f.intervals[k][0]))/this.grid.ScaleY*this.grid.GridSpace+.5;
                this.ctx.beginPath();

                for (var i = Math.max(-this.grid.OriginX, f.intervals[k][0]/this.grid.ScaleX)*this.grid.GridSpace+1; i <= Math.min(f.intervals[k][1]*this.grid.GridSpace/this.grid.ScaleX+.5, this.canvas.width-this.grid.OriginX*this.grid.GridSpace+.5); i+=this.grid.dx){
                    now = -this.grid.GridSpace*f.func(i/this.grid.GridSpace*this.grid.ScaleX)/this.grid.ScaleY+.5;
                    if (Math.abs(now-prev)>300 || CheckPoles(i, this.grid.GridSpace*this.grid.ScaleX) || now === NaN) {this.ctx.moveTo(i+.5, now);}
                    else this.ctx.lineTo(i+.5, now);

                    if (((now > prev && prev <= prevprev) || (now < prev && prev >= prevprev)) && Math.min(prevprev,prev,now) > -this.grid.GridSpace*this.grid.OriginY-40) {
                        f.derivZeros.push(i/this.grid.GridSpace*this.grid.ScaleX);
                    }
                    
                    if (((.5 >= prev && .5 <= now) || (.5 <= prev && .5 >= now)) && i > Math.max(-this.grid.OriginX, f.intervals[k][0]/this.grid.ScaleX)*this.grid.GridSpace+2){
                        f.zeros.push(i/this.grid.GridSpace*this.grid.ScaleX);
                    }
                    prevprev = prev;
                    prev = now;
                }

                this.ctx.stroke();
            }
        })
    }

    drawGrid(){
        if(this.grid.Grid){
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#dddddd';
            
            for (var i = -Math.ceil(this.grid.OriginX); i < Math.ceil(this.canvas.width/this.grid.GridSpace-this.grid.OriginX); i++){
                this.ctx.beginPath();
                this.ctx.moveTo(i*this.grid.GridSpace+.5, -this.grid.GridSpace*this.grid.OriginY);
                this.ctx.lineTo(i*this.grid.GridSpace+.5, -this.grid.GridSpace*this.grid.OriginY+this.canvas.height);
                this.ctx.stroke();
            }

            for (var i = -Math.ceil(this.grid.OriginY); i < Math.ceil(this.canvas.height/this.grid.GridSpace-this.grid.OriginY); i++){
                this.ctx.beginPath();
                this.ctx.moveTo(-this.grid.GridSpace*this.grid.OriginX,i*this.grid.GridSpace+.5);
                this.ctx.lineTo(-this.grid.GridSpace*this.grid.OriginX+this.canvas.width, i*this.grid.GridSpace+.5);
                this.ctx.stroke();
            }
        }

        //main Axis
        if(!this.grid.Axis) return;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(-this.grid.GridSpace*this.grid.OriginX,.5);
        this.ctx.lineTo(-this.grid.GridSpace*this.grid.OriginX+this.canvas.width,.5);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(.5, -this.grid.GridSpace*this.grid.OriginY);
        this.ctx.lineTo(.5, -this.grid.GridSpace*this.grid.OriginY+this.canvas.height);
        this.ctx.stroke();
    }

    drawArrows(){
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(-3.5,-this.grid.GridSpace*this.grid.OriginY+7.5);
        this.ctx.lineTo(.5,-this.grid.GridSpace*this.grid.OriginY+1.5);
        this.ctx.lineTo(4.5,-this.grid.GridSpace*this.grid.OriginY+7.5);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width-this.grid.GridSpace*this.grid.OriginX-7.5, 4.5);
        this.ctx.lineTo(this.canvas.width-this.grid.GridSpace*this.grid.OriginX-1.5,.5);
        this.ctx.lineTo(this.canvas.width-this.grid.GridSpace*this.grid.OriginX-7.5,-3.5);
        this.ctx.stroke();
    }

    drawUmfang(){
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke(); 
    }
}