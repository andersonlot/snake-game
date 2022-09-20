
let canva;
let canva_width = 400;
let loopGame = false;
var state = {
  up: false,
  down: false,
  left: false,
  right: false,
  reset: function () {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
  }
};
function setup() {
  frameRate(60);
  DivCanvas = document.getElementById("canvas");
  DivCanvas.textContent = "";
  if (windowWidth < 475) {
    canva_width = windowWidth - 75;
  }
  canva = createCanvas(canva_width, 400);
  canva.parent('canvas');
  tamqua = 20;
  foods=[];
  for(let i=0;i<3;i++){
    foods[i]= new food();
  }
  veneno = new poison();
  cobra = new snake();
  cobra.aumentacalda();
  cobra.aumentacalda();
  cobra.aumentacalda();
}

function draw() {

  //var lang = document.head.lang;
  clear();
  background(255, 200, 0, 10);
  if (!loopGame) {
    cursor('default')
    push();
    textAlign(CENTER, CENTER);
    fill(255, 200, 0);
    textStyle(BOLD)
    textSize(30 + 3 * sin(frameCount / 50));
    text(" START! ", width / 2, height / 2 - 3 * sin(frameCount / 50));
    pop();
    if (mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > height / 2 - 3 * sin(frameCount / 50) - 15 && mouseY < height / 2 - 3 * sin(frameCount / 50) + 15) {
      cursor('pointer');
      if (mouseIsPressed) {
        loopGame = true;
      }
    }
    cobra.state.down = true;
  }
  if (loopGame) {
    noCursor();
    veneno.draw();
    cobra.draw();
    for(let i in foods){
      foods[i].draw();
      foods[i]=cobra.eat(foods[i]);
    }
    veneno = cobra.eat(veneno);
    fill(255);
    textStyle(BOLD);
    textSize(15);
    text(cobra.score, 20, 25);
    cobra.move();
  }
}
function keyPressed() {
  let _key = key;
  if (_key === "ArrowLeft" || _key === "ArrowUp" || _key === "ArrowDown" || _key === "ArrowRight") {
    cobra.changeDirection(_key);
    return false;
  }

}
class snake {
  constructor() {
    this.p = createVector(200, 200);
    this.p_snake = [this.p];
    this.score = 0;
    this.state = state;
    this.countToMove = 0;
    this.countMax = 8;
  }
  draw() {
    push();
    fill("white");
    //stroke("black");
    //strokeWeight(tamqua / 10);
    for (let i = 0; i < this.p_snake.length; i++) {
      fill(255,255,50);
      if((i%3)===0){
        fill(255,150,50);
      }
      if(i===this.p_snake.length-1){
        square(this.p_snake[i].x+5, this.p_snake[i].y+5, tamqua-10,2);
      }else{
        if(i===this.p_snake.length-2){
          square(this.p_snake[i].x+4, this.p_snake[i].y+4, tamqua-8,2);
        }else{
          if(i===this.p_snake.length-3){
            square(this.p_snake[i].x+3, this.p_snake[i].y+3, tamqua-6,3);
          }else{
            square(this.p_snake[i].x+1, this.p_snake[i].y+1, tamqua-2,4);
          }
        }
      }
    }
    noStroke();
    fill("white");
    circle(this.p.x + tamqua / 4, this.p.y + tamqua / 3, tamqua / 3);
    circle(this.p.x + (3 * tamqua) / 4, this.p.y + tamqua / 3, tamqua / 3);
    fill("black");
    circle(this.p.x + tamqua / 4, this.p.y + tamqua / 3, tamqua / 4);
    circle(this.p.x + (3 * tamqua) / 4, this.p.y + tamqua / 3, tamqua / 4);
    pop();
  }
  changeDirection(_key) {
    if (_key == "ArrowUp" && !this.state.down && !this.state.up) {
      this.state.reset();
      this.state.up = true;
    }
    if (_key == "ArrowDown" && !this.state.up && !this.state.down) {
      this.state.reset();
      this.state.down = true;
    }
    if (_key == "ArrowLeft" && !this.state.right && !this.state.left) {
      this.state.reset();
      this.state.left = true;
    }
    if (_key == "ArrowRight" && !this.state.left && !this.state.right) {
      this.state.reset();
      this.state.right = true;
    }
  }
  move() {
    let p_old = this.p.copy();
    this.countToMove++;
    if (this.countToMove > this.countMax) {
      this.countToMove = 0
      if (this.state.up) {
        this.p.y -= tamqua;
      }
      if (this.state.down) {
        this.p.y += tamqua;
      }
      if (this.state.left) {
        this.p.x -= tamqua;
      }
      if (this.state.right) {
        this.p.x += tamqua;
      }
      if (this.p.x >= width) {
        this.p.x = 0;
      }
      if (this.p.x < 0) {
        this.p.x = width - tamqua;
      }
      if (this.p.y >= height) {
        this.p.y = 0;
      }
      if (this.p.y < 0) {
        this.p.y = height - tamqua;
      }
      this.atualiza_p_snake(p_old);
    }
  }
  eat(com_) {
    if (com_.class == "food") {
      if (this.p.x == com_.p.x && this.p.y == com_.p.y) {
        this.score++;
        this.aumentacalda();
        return new food();
      } else {
        return com_;
      }
    } else {
      if (com_.class == "poison") {
        if (this.p.x == com_.p.x && this.p.y == com_.p.y) {
          this.score--;
          this.diminuicalda();
          return new poison();
        } else {
          return com_;
        }
      }
    }
  }
  aumentacalda() {
    this.p_snake.push(createVector(this.p.x, this.p.y));
  }
  diminuicalda() {
    this.p_snake.pop();
  }
  atualiza_p_snake(p_old) {
    for (let i = this.p_snake.length - 1; i > 0; i--) {
      this.p_snake[i] = this.p_snake[i - 1].copy();
    }
    if (this.p_snake.length > 1) {
      this.p_snake[1] = p_old.copy();
    }
    if (this.p_snake.length == 1) {
      this.p_snake[0] = this.p;
    }
  }
}
class food {
  constructor() {
    this.class = "food";
    this.p = createVector(
      tamqua * Math.trunc(random(0, width / tamqua)),
      tamqua * Math.trunc(random(0, height / tamqua))
    );
  }
  draw() {
      noStroke();
      fill(255, 70, 30);
      //squ,,re(this.p.x, this.p.y, tamqua);
      var sineWave=sin(frameCount/10);
      circle(this.p.x + tamqua / 2, this.p.y + tamqua / 2, tamqua * (0.8+0.1*sineWave));

  }
}
class poison {
  constructor() {
    this.class = "poison";
    this.p = createVector(
      tamqua * Math.trunc(random(0, width / tamqua)),
      tamqua * Math.trunc(random(0, height / tamqua))
    );
    this.pisca = 0;
    this.contframe = 0;
  }
  draw() {
    if (this.pisca) {
      this.contframe++;
      if (this.contframe >= 7) {
        this.contframe = 0;
        this.pisca = 0;
      }
    }
    if (this.pisca == 0) {
      this.contframe++;
      noStroke();
      fill(255, 0, 255);
      //squ,,re(this.p.x, this.p.y, tamqua);
      circle(this.p.x + tamqua / 2, this.p.y + tamqua / 2, tamqua * 0.8);
      push();
      stroke("green");
      strokeWeight(tamqua / 10);
      line(
        this.p.x + tamqua / 2,
        this.p.y + tamqua / 2 - tamqua / 5,
        this.p.x + tamqua / 2 + tamqua / 10,
        this.p.y + tamqua / 2 - tamqua / 2
      );
      fill("green");
      noStroke();
      triangle(
        this.p.x + tamqua / 2,
        this.p.y + tamqua / 2 - 0.3 * tamqua,
        this.p.x + tamqua / 2 + 0.1 * tamqua,
        this.p.y + tamqua / 2 - 0.5 * tamqua,
        this.p.x + tamqua / 2 - 0.2 * tamqua,
        this.p.y + tamqua / 2 - 0.45 * tamqua
      );
      pop();
      if (this.contframe >= 7) {
        this.contframe = 0;
        this.pisca = 1;
      }
    }
  }
}
///////////////////////////////////////////////
function quadricular(dist, cor) {
  push();
  stroke(cor);
  for (let x = dist; x < width; x += dist) {
    line(x, 0, x, height);
  }
  for (let y = dist; y < height; y += dist) {
    line(0, y, width, y);
  }
  pop();
}
///////////////////////////////////////////////
