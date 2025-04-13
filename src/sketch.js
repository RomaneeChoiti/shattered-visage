import p5 from 'p5';
import ml5 from 'ml5';
import WaterBlob from './components/WaterBlob.js';
import { setTargetBlobPositionAndColor } from './utils/faceUtils.js';

let waterBlob;
let lastUpdateTime = 0;
const updateInterval = 50;

let previousLandmarks = []; // 이전 프레임의 랜드마크 좌표
let movementMagnitude = 0; // 움직임 크기
let targetRadius = 0;
let targetColor;
let currentColor;

function setup() {
  createCanvas(1080, 720);
  initializeVideo();
  initializeFaceAPI(() => {
    console.log("FaceAPI 모델 로드 완료");
    detectFaces();
  });
  waterBlob = new WaterBlob(width / 2, height / 2, 100, color(50, 150, 255));
  currentColor = color(50, 150, 255);
  targetColor = currentColor;
}

function draw() {
  background(10, 10, 30); // 어두운 배경

  const currentTime = millis();

  // 얼굴 데이터 업데이트
  if (currentTime - lastUpdateTime > updateInterval) {
    lastUpdateTime = currentTime;
    if (detections && detections.length > 0) {
      const landmarks = detections[0].landmarks.positions;
      const faceOutline = landmarks.slice(0, 17); // 얼굴 윤곽
      const mouth = landmarks.slice(48, 68); // 입
      const leftEye = landmarks.slice(36, 42);
      const rightEye = landmarks.slice(42, 48);
      const nose = landmarks.slice(27, 36);

      setTargetBlobPositionAndColor(
        landmarks,
        faceOutline,
        mouth,
        leftEye,
        rightEye,
        nose
      );
    }
  }

  // 물 형상 업데이트 및 그리기
  waterBlob.update();
  waterBlob.display();
}

// 부드럽게 움직이는 물 형상 클래스
class WaterBlob {
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
