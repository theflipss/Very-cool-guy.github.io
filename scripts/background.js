//#region Variablen

var canvas = document.getElementById("CAN");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

const BALLS = Density(.12);
const Radius = 2;
const MaxVelocity = 2;
const LinienAbstand = 100;
const MouseEffectRadius = 200;
const LinienLimit = Infinity;
const MouseVeranstaltung = true;
const ColorPallet = [
    "#fe9854",
    "#ef7578",
    "#c16791",
    "#846194",
    "#4c587d",
    "#2f4858"
]
var LinienAnzahl = 0;
var particles = [];
var MousePos = {
    X: undefined,
    Y: undefined
};
var FPSConterAnAus = false;
var TimeThen = Date.now();
var FPSDisplay = document.getElementById("FPSCounter");

//#endregion

//#region Other functions

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function Density(Density) {
    let x = window.innerWidth;
    let y = window.innerHeight;
    x /= 10;
    y /= 10;
    x *= Density;
    y *= Density;
    let xy = x * y;
    xy = Math.round(xy);
    console.log(xy);
    return xy;
}

function FPSCounter() {
    let TimeNow = Date.now();
    let x = TimeNow - TimeThen;
    x /= 1000;
    x = 1 / x;
    TimeThen = Date.now();
    x = Math.round(x);
    FPSDisplay.innerHTML = x;
    // FPSDisplay.innerText = x;
}

function RandomZahlBetwen(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Abstand(X1, Y1, X2, Y2) {
    let TotalX = X1 - X2;
    let TotalY = Y1 - Y2;
    return Math.sqrt(Math.pow(TotalX, 2) + Math.pow(TotalY, 2));
}

function Clamp(min, max, int) {
    if (int > max) {
        return max;
    }
    if (int < min) {
        return min;
    }
    return int;
}

function ForceField(XBall, YBall, X2, Y2) {
    let VectorLaenge = Abstand(XBall, YBall, X2, Y2);
    let Total = {
        X: XBall - X2,
        Y: YBall - Y2
    }
    VectorLaenge = map_range(VectorLaenge, 0, MouseEffectRadius, 1, .001);
    VectorLaenge *= 1000;
    VectorLaenge = Math.floor(VectorLaenge);
    VectorLaenge /= 1000;
    Total.X *= VectorLaenge;
    Total.Y *= VectorLaenge;
    // console.log(VectorLaenge);
    return Total
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("mouseout", function () {
    MousePos.X = undefined;
    MousePos.Y = undefined;
});

window.addEventListener("mousemove", function (event) {
    MousePos.X = event.x;
    MousePos.Y = event.y;
});

//#endregion

//#region Main

function Particle(StartX, StartY, Radius, VelocityX, VelocityY, I, Color, LineArry = []) {

    this.X = StartX;
    this.Y = StartY;
    this.R = Radius;
    this.ValX = VelocityX;
    this.ValY = VelocityY;
    this.StartValX = VelocityX;
    this.StartValY = VelocityY;
    this.Index = I;
    this.Color = Color;
    this.LinesTo = LineArry;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.R, 0, Math.PI * 2, false);
        ctx.fillStyle = this.Color;
        ctx.fill();
    }

    this.drawLine = function () {
        for (let index = 0; index < particles.length; index++) {
            if (LinienAnzahl < LinienLimit && this.Index != index) {
                if (this.LinesTo[index] != index) {
                    if (Abstand(particles[index].X, particles[index].Y, this.X, this.Y) < LinienAbstand) {
                        particles[index].LinesTo[this.Index] = this.Index;
                        ctx.beginPath();
                        ctx.moveTo(this.X, this.Y);
                        ctx.lineTo(particles[index].X, particles[index].Y);
                        ctx.strokeStyle = "rgba(255, 255, 255, .4)";
                        ctx.lineWidth = map_range(Abstand(particles[index].X, particles[index].Y, this.X, this.Y), 0, LinienAbstand, 5, 0);
                        ctx.stroke();
                        LinienAnzahl++;
                    }
                }
            }
        }
    }

    this.update = function () {
        this.X += this.ValX;
        this.Y += this.ValY;

        if (Abstand(MousePos.X, MousePos.Y, this.X, this.Y) < MouseEffectRadius && MouseVeranstaltung == true) {
            let Force = ForceField(this.X, this.Y, MousePos.X, MousePos.Y)
            this.ValX = Force.X;
            this.ValY = Force.Y;
        } else {
            this.ValX = this.StartValX;
            this.ValY = this.StartValY;
        }

        if (this.X > window.innerWidth + this.R || this.X < 0 - this.R) {
            if (this.ValX > 0) {
                particles[this.Index] = new Particle(-this.R, this.Y, this.R, this.StartValX, this.StartValY, this.Index, this.Color);
            } else {
                particles[this.Index] = new Particle(window.innerWidth + this.R, this.Y, this.R, this.StartValX, this.StartValY, this.Index, this.Color, this.LinesTo);
            }
        }
        if (this.Y > window.innerHeight + this.R || this.Y < 0 - this.R) {
            if (this.ValY > 0) {
                particles[this.Index] = new Particle(this.X, -this.R, this.R, this.StartValX, this.StartValY, this.Index, this.Color);
            } else {
                particles[this.Index] = new Particle(this.X, window.innerHeight + this.R, this.R, this.StartValX, this.StartValY, this.Index, this.Color, this.LinesTo);
            }
        }
        this.draw();
    }

}

//#endregion

//#region Animate

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let index = 0; index < particles.length; index++) {
        particles[index].drawLine();
    }
    for (let index = 0; index < particles.length; index++) {
        particles[index].update();
    }
    for (let index = 0; index < particles.length; index++) {
        particles[index].LinesTo = [];
    }
    LinienAnzahl = 0;
    // console.log(LinienAnzahl);
    if (FPSConterAnAus) {
        FPSCounter();
    }
}

for (let index = 0; index < BALLS; index++) {
    let X = RandomZahlBetwen(Radius, window.innerWidth - Radius);
    let Y = RandomZahlBetwen(Radius, window.innerHeight - Radius);
    // let r = RandomZahlBetwen(1, Radius);
    let C = ColorPallet[RandomZahlBetwen(0, ColorPallet.length)];
    let VX = (Math.random() - 0.5) * MaxVelocity;
    let VY = (Math.random() - 0.5) * MaxVelocity;
    particles.push(new Particle(X, Y, Radius, VX, VY, index, C));
}
animate();
//#endregion