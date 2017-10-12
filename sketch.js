var dots;
var canvasColor;
var dotAmplitude;
canvasColor = 0;

var canvasSize = {
    'width': innerWidth - 30,
    'height': innerHeight - 30
};
      function setup() {
          dots = [];
          
          createCanvas(canvasSize.width, canvasSize.height);
          background(canvasColor);                        
          noStroke();

      }

// how make collisions happen closer to impact time?
// how can I rotate from portrait to landscape w/o change for worse?
      function draw() {
          background(128)
          dotAmplitude = Math.floor(1 / dots.length * 0.01);
          for (var i=0; i<= dots.length - 1; i++) {
              dots[i].detectEdgeCollision(dotAmplitude);
              dots[i].detectDotCollision(dots);
              dots[i].move();
              dots[i].display();
            }
      }
            
      function Dot() {
          this.x = mouseX;
          this.y = mouseY;
          this.diameter = 50;
          this.speed = {
              'x': 10,
              'y': 10
          };
          
          
          
          this.color = random(255);
          
          // some arbitrary arpreggio 
          this.scaleArray = [48, 51, 55, 60];
          this.note = 0;
          
          this.osc = new p5.SawOsc();
          this.osc.amp(0);
          
          
          // Instantiate the envelope
          this.envelope = new p5.Env();
          
          // set attackTime, decayTime, sustainRatio, releaseTime
          this.envelope.setADSR(0.001, 0.5, 0.01, 0.25);
          
          // set attackLevel, releaseLevel
          this.envelope.setRange(0.5, 0);
          this.osc.start();
          
          this.pluck = function(amplitude) {
              // explicitly describe (gracefully) ending note if new note starts
              this.note = Math.floor(random(this.scaleArray.length));
              this.midiValue = this.scaleArray[this.note];
              this.freqValue = midiToFreq(this.midiValue);
              this.osc.freq(this.freqValue);
              this.osc.amp(amplitude);
              this.envelope.play(this.osc, 0, 0.1);
          }
          
          this.move = function() {
              this.x += this.speed.x;
              this.y += this.speed.y;
          };          
          this.display = function() {
              fill(this.color);
              ellipse(this.x, this.y, this.diameter, this.diameter);
          }

          // determine if another dot is touching this one
          this.detectDotCollision = function(dotArray){
              // cycle through array of dots
              for(var i=0; i < dotArray.length; i++) {
                  
                  // skip itself
                  if(dotArray[i] !== this){
                      
                      //colliding with anything?
                      this.hit = collideCircleCircle(
                          this.x, this.y, this.diameter, dotArray[i].x, dotArray[i].y, dotArray[i].diameter
                      ); 
                      
                      if(this.hit === true){
                          dotArray[i].x.speed = -1 * dotArray[i].speed.x;
                          dotArray[i].y.speed = -1 * dotArray[i].x.speed;
                          this.speed.x = -1 * this.speed.x;
                          this.speed.y = -1 * this.speed.y;
                          // cludge to prevent dots from getting 'stuck' together
                          this.x += this.diameter + 5;
                          this.y += this.diameter + 5;
                          
                      }
                  }
              }
          }
          
          this.detectEdgeCollision = function(amps) {
              // horizontal edge detection
              if (this.x + this.diameter > canvasSize.width) {
                  this.pluck(amps);
                  this.speed.x = this.speed.x * -1;
                  this.x -= this.diameter - 5;
                  
              } 
              if (this.x - this.diameter < 0) {
                  this.pluck(amps);
                  this.speed.x = this.speed.x * -1;
                  this.x += this.diameter + 5;
              };
              
              // vertical edge detection
              if (this.y + this.diameter > canvasSize.height) {
                  this.pluck(amps);
                  this.speed.y = this.speed.y * -1;
                  this.y -= this.diameter - 5;
              } 
              if (this.y - this.diameter < 0) {
                  this.pluck(amps);
                  this.speed.y = this.speed.y * -1;
                  this.y += this.diameter + 5;
              };
          };
      }
      
      function touchEnded() {
          dots.push(new Dot());
          return false;
      }

      // Was refreshing size on each iteration. now that the size of the canvas is fixed, is not called. Refactoring.
      function windowResized() {
          resizeCanvas(canvasSize.width,canvasSize.height);
      }
  

