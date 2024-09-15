import p5Types from "p5";

let firework: Firework;
let startTime: number;
let noiseScale = 0.02;
let drawDuration = 120; // 描画にかかるフレーム数
let lifetime = 360; // 全体の寿命（フレーム数）
let currentFrame = 0;
let test1 = 0;
let test2 = 0;
let test3 = 0;

// Na (200, 200, 0);
// Ca (244, 69, 0);
// Ka (216, 109, 255);
// Li (219, 0, 0);
// Sr (216, 0, 79);
// Ba (167, 232, 34);
// Cu (0, 192, 151);
let metalcolors = [200, 200, 0, 244, 69, 0, 216, 109, 255, 219, 0, 0, 216, 0, 79, 167, 232, 34, 0, 192, 151];
let colors = [2, 1, 6]; //// Na (200, 200, 0); // Ca (244, 69, 0); // Li (219, 0, 0);


let cx = 520;
let cy = 450;

let canvasParent: Element;
let parentStyle: CSSStyleDeclaration;
let canvasWidth: number, canvasHeight: number;

const setup = (p5: p5Types, canvasParentRef: Element) => {
    // Find the parent Element's size to create a Canvas that size
    canvasParent = canvasParentRef;
    if (canvasParentRef.parentElement) {
        parentStyle = getComputedStyle(canvasParentRef.parentElement);
    } else {
        parentStyle = getComputedStyle(canvasParentRef);
    }
    canvasWidth = parseInt(parentStyle.width);
    canvasHeight = parseInt(parentStyle.height);  
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef); 

    p5.noStroke();
    let maxRadius = p5.min(p5.width, p5.height) * 0.45;
    
    firework = new Firework(p5, p5.width / 2, 1080, cx, cy, colors);
    startTime = p5.millis();
}

const draw = (p5: p5Types) => {
    p5.background(0, 25);
  
  let currentTime = p5.millis() - startTime;
  firework.update(currentTime);
  firework.display();
}

class Firework {
  p5: p5Types;
  private start: p5Types.Vector;
  private center: p5Types.Vector;
  private phase: number;
  private particles: Particle[];
  private radiusLightsNum: number;
  private numLights: number;
  private trailPoints: {x: number, y: number}[];

  constructor(p5: p5Types, x1: number, y1: number, x2: number, y2: number, colors: number[]) {
    this.p5 = p5;
    this.start = p5.createVector(x1, y1);
    this.center = p5.createVector(x2, y2);
    this.phase = 0;
    this.particles = [];
    
    this.radiusLightsNum = 12;
    this.numLights = 18;
    this.trailPoints = [];

    // 円内にランダムに発光エフェクトを配置
    for (let i = 0; i < this.radiusLightsNum; i++) {
        for (let j = 0; j < this.numLights + i*3; j++) {
          let radius = i*4 + p5.random(-2, 2); 
          let angle = (j / (this.numLights + i*3))*p5.TAU + p5.random(-p5.TAU/60-p5.TAU/60);
          let pos = p5.createVector(this.center.x + p5.cos(angle) * radius, this.center.y + p5.sin(angle) * radius);

          let r = 0;
          let g = 0;
          let b = 0;

          if (i > 9) {
            r = metalcolors[3 * colors[2]];
            g = metalcolors[3 * colors[2] + 1];
            b = metalcolors[3 * colors[2] + 2];
            if (test1 == 0){
              console.log("outer", r,g,b);
              test1 = 1;
            }
          } else if (i > 4) {
            r = metalcolors[3 * colors[1]];
            g = metalcolors[3 * colors[1] + 1];
            b = metalcolors[3 * colors[1] + 2];
            if (test2 == 0){
              console.log("middle", r,g,b);
              test2 = 1;
            }
          } else if (i > 0) {
            r = metalcolors[3 * colors[0]];
            g = metalcolors[3 * colors[0] + 1];
            b = metalcolors[3 * colors[0] + 2];
            if (test3 == 0){
              console.log("inner", r,g,b);
              test3 = 1;
            }
          }
          
          console.log(p5.int((i/4)%3));
          
          this.particles.push(new Particle(p5, this.center.x, this.center.y, pos.x, pos.y, r, g, b));
        }
     }   
     generatePoints(p5, this.trailPoints, this.start.x, this.start.y, this.center.x, this.center.y);
  }
  
  update(time: number): void {
    if (time < 2000) {
      this.phase = 1;
    } else if (time < 3000) {
      this.phase = 2;
    } else if (time < 4500) {
      this.phase = 3;
    } else if (time < 6500) {
      this.phase = 4;
    } else {
      this.phase = 0;
    }
  }
  
  display(): void {
    switch (this.phase) {
      case 1:
        this.displayTail();
        break;
      case 2:
        this.displayExplosion();
        break;
      case 3:
        this.displayExplosion();
        break;
      case 4:
        this.displayGlowingLight();
        break;
    }
  }
  
  displayTail(): void {
    if (currentFrame <= lifetime) {
        drawWigglyLine(this.p5, currentFrame, this.trailPoints);
        currentFrame++;
    }
  }
  
  displayExplosion(): void {
    for (let particle of this.particles) {
      particle.update();
      particle.display();
    }
  }
  
  displayGlowingLight(): void {
    for (let particle of this.particles) {
        drawGlowingLight(this.p5, particle.pos.x, particle.pos.y, particle.r+this.p5.random(-90, 90), particle.g+this.p5.random(-90, 90), particle.b+ this.p5.random(-90, 90), particle.size);
    }
  }
}

class Particle {
  p5: p5Types;
  lifetime: number;
  vel: p5Types.Vector;
  acc: p5Types.Vector;
  pos: p5Types.Vector;
  r: number;
  g: number;
  b: number;
  size: number;

  constructor(p5: p5Types, cx: number, cy: number, tx: number, ty: number, r: number, g: number, b: number) {
    this.p5 = p5;
    this.lifetime = 255;
    this.vel = p5.createVector((tx-cx)/5, (ty-cy)/5);
    this.acc = p5.createVector(0, 0.02);
    this.pos = p5.createVector(cx, cy);
    this.r = r;
    this.g = g;
    this.b = b;

    this.size = p5.random(100, 190);
  }
  
  update(): void {
    if(this.lifetime > 0){
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.lifetime -= 5;      
    } 
  }
  
  display(): void {
    if (this.lifetime > 0) {
        this.p5.stroke(this.r, this.g, this.b, this.lifetime);
        this.p5.strokeWeight(0.2);
        this.p5.point(this.pos.x, this.pos.y);
    }
  }
}

const drawGlowingLight = (p5: p5Types, x: number, y: number, r: number, g: number, b: number, maxSize: number) => {
    // グラデーションを作成
    for (let i = 5; i > 0; i--) {
        let alpha = p5.map(i, 8, 0, 8, 0)
        let size = p5.map(i, 8, 0, maxSize, 5);
        p5.fill(r, g, b, alpha);
        p5.ellipse(x, y, size);
    }

    // 中心の明るい部分
    p5.blendMode(p5.ADD);
    for (let i = 4; i > 0; i--) {
        let alpha = p5.map(i, 6, 0, 40, 0);
        let size = p5.map(i, 4, 0, maxSize * 0.2, 5);
        p5.fill(r, g, b, 50);
        p5.ellipse(x, y, size);
    }
    p5.blendMode(p5.BLEND);
}

const generatePoints = (p5: p5Types, trailPoints: {x: number, y: number}[], x1: number, y1: number, x2: number, y2: number) => {
    let segments = 1000;
    let amplitude = 20;

    for (let i = 0; i <= segments; i++) {
        let t = i / segments;
        let x = p5.lerp(x1, x2, t);
        let y = p5.lerp(y1, y2, t);

        let offsetX = (p5.noise(x * noiseScale, y * noiseScale, 0) - 0.5) * amplitude;
        let offsetY = (p5.noise(x * noiseScale, y * noiseScale, 1000) - 0.5) * amplitude;

        trailPoints.push({x: x + offsetX, y: y + offsetY});
    }
}

const drawWigglyLine = (p5: p5Types, frame: number, trailPoints: {x: number, y: number}[]) => {
    p5.noFill();
    p5.stroke(255, 255, 255, 20);
    p5.strokeWeight(3);

    p5.beginShape();
    for (let i = 0; i < trailPoints.length; i++) {
        let appearTime = (i / trailPoints.length) * drawDuration;
        let disappearTime = drawDuration + (i / trailPoints.length) * (lifetime - drawDuration) - 150;

        if (frame < appearTime) {
            continue; // まだ描画しない
        } else if (frame > disappearTime) {
            continue; // すでに消えている
        }

        let alpha = 255;
        if (frame > drawDuration) {
            // 消えていく過程
            alpha = p5.map(frame, disappearTime - 30, disappearTime, 255, 0);
        }
        alpha = p5.constrain(alpha, 0, 255);

        p5.stroke(255, alpha);
        p5.vertex(trailPoints[i].x, trailPoints[i].y);
    }
    p5.endShape();
};

// Keep canvas and its content responsive across window resizes
const windowResized = (p5: p5Types) => {
  let parentStyle: CSSStyleDeclaration;
  if (canvasParent.parentElement) {
    parentStyle = getComputedStyle(canvasParent.parentElement);
  } else {
    parentStyle = getComputedStyle(canvasParent);
  }
  canvasWidth = parseInt(parentStyle.width);
  canvasHeight = parseInt(parentStyle.height);
  p5.resizeCanvas(canvasWidth, canvasHeight);
};

export { setup, draw, windowResized };
