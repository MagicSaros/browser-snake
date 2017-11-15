class CanFi {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
    }

    line (xStart, yStart, xEnd, yEnd) {
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();
    }
    
    strokeCircle (xCenter, yCenter, radius) {
        this.ctx.beginPath();
        this.ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    }
    
    fillCircle (xCenter, yCenter, radius) {
        this.ctx.beginPath();
        this.ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, true);
        this.ctx.fill();
    }

    strokeDiamond (xStart, yStart, width, height) {
        let xCenter = xStart + width / 2;
        let yCenter = yStart + height / 2;
        let xEnd = xStart + width;
        let yEnd = yStart + height;
        this.line(xCenter, yStart, xEnd, yCenter);
        this.line(xEnd, yCenter, xCenter, yEnd);
        this.line(xCenter, yEnd, xStart, yCenter);
        this.line(xStart, yCenter, xCenter, yStart);
    }

    // fillDiamond (xStart, yStart, width, height) {
    //     this.ctx.beginPath();
    //     let xCenter = xStart + width / 2;
    //     let yCenter = yStart + height / 2;
    //     let xEnd = xStart + width;
    //     let yEnd = yStart + height;
    //     this.line(xCenter, yStart, xEnd, yCenter);
    //     this.line(xEnd, yCenter, xCenter, yEnd);
    //     this.line(xCenter, yEnd, xStart, yCenter);
    //     this.line(xStart, yCenter, xCenter, yStart);
    //     this.ctx.fill();
    //}
}