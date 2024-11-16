class MouseEventObj{
    constructor(inputFieldX, inputFieldY, ScaleX, ScaleY){
        this.inputFieldX = inputFieldX;
        this.inputFieldY = inputFieldY;
        this.ScaleFX = ScaleX;
        this.ScaleFY = ScaleY;
        this.mouseMove = false;
        this.ScrollX = 0;
        this.ScrollY = 0;
        this.clickmousepos = {
            x: 0,
            y: 0
        }
        Grapher.canvas.addEventListener("mousedown", (e) => {
            this.mouseMove = true;
            this.clickmousepos.x = e.clientX;
            this.clickmousepos.y = e.clientY;
            this.cMouseClick();
        });
        document.addEventListener("mouseup", () => this.mouseMove = false);
        document.addEventListener("mousemove", (e) => {if (this.mouseMove) this.onMouseMove(e)});
        
        Grapher.canvas.addEventListener("mouseleave", () => document.onkeypress=function(){});
    }

    cMouseClick(){
        var scaleAxis = (x) => {
            Grapher.drawEnabled = false;
            Grapher.grid.ScaleX *= x;
            this.ScaleFX.latex(Grapher.grid.ScaleX);
            Grapher.grid.ScaleY *= x;
            this.ScaleFY.latex(Grapher.grid.ScaleY);

            Grapher.grid.OriginX *= x;
            Grapher.grid.oxInput = -Grapher.grid.OriginX*Grapher.grid.ScaleX;
            Grapher.grid.oyInput *= x;
            this.inputFieldX.latex(Math.round(-Grapher.grid.OriginX*Grapher.grid.ScaleX*1000)/1000);
            Grapher.drawEnabled = true;
            this.inputFieldY.latex(Math.round((Grapher.grid.OriginY - Grapher.canvas.height/Grapher.grid.GridSpace) * Grapher.grid.ScaleY*1000)/1000);
        }

        document.onkeypress = (e) => {
            if (e.key === "+"){
                scaleAxis(.5)
            } else if (e.key === "-"){
                scaleAxis(2)
            }
        }
    }

    onMouseMove(e){
        Grapher.drawEnabled = false;
        Grapher.grid.OriginX -= (this.clickmousepos.x - e.clientX)/Grapher.grid.GridSpace;
        this.clickmousepos.x = e.clientX;
        Grapher.grid.OriginY -= (this.clickmousepos.y - e.clientY)/Grapher.grid.GridSpace;
        this.clickmousepos.y = e.clientY;
        Grapher.grid.oyInput = (Grapher.grid.OriginY - Grapher.canvas.height/Grapher.grid.GridSpace) * Grapher.grid.ScaleY;
        this.inputFieldX.latex(Math.round(-Grapher.grid.OriginX*Grapher.grid.ScaleX*1000)/1000);
        Grapher.drawEnabled = true;
        this.inputFieldY.latex(Math.round((Grapher.grid.OriginY - Grapher.canvas.height/Grapher.grid.GridSpace) * Grapher.grid.ScaleY*1000)/1000);
    }
}