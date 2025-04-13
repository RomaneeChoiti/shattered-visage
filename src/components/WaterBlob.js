export default class WaterBlob {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.noiseOffset = random(1000);
  }

  update() {
    this.radius = lerp(this.radius, targetRadius, 0.1);
    currentColor = lerpColor(currentColor, targetColor, 0.1);
  }

  display() {
    stroke(100, 150, 255, 180);
    strokeWeight(1);
    fill(currentColor);

    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += radians(10)) {
      let noiseValue = noise(
        cos(angle) + this.noiseOffset,
        sin(angle) + this.noiseOffset
      );
      let r = this.radius + map(noiseValue, 0, 1, -15, 15);
      let x = this.x + r * cos(angle);
      let y = this.y + r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    this.displayHighlight();
    this.noiseOffset += 0.01;
  }

  displayHighlight() {
    noStroke();
    fill(255, 255, 255, 150);
    ellipse(
      this.x - this.radius / 3,
      this.y - this.radius / 3,
      this.radius / 4
    );
  }
}
