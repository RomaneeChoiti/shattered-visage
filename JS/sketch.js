let facialFeatures = []; // 얼굴 랜드마크를 저장할 배열
const featureLifespan = 3000; // 랜드마크 유지 시간 (밀리초)
const updateInterval = 500; // 랜드마크를 추가할 간격 (밀리초)
let lastUpdateTime = 0; // 마지막으로 랜드마크가 추가된 시간

function setup() {
  createCanvas(640, 480); // 캔버스 크기 설정
  initializeVideo(); // 웹캠 초기화
  initializeFaceAPI(() => {
    console.log("FaceAPI 모델 로드 완료");
    detectFaces(); // 얼굴 감지 시작
  });
}

function draw() {
  background(0); // 검정 배경

  const currentTime = millis();

  // 특정 시간마다 새로운 랜드마크 추가
  if (currentTime - lastUpdateTime > updateInterval) {
    lastUpdateTime = currentTime; // 업데이트 시간 갱신
    if (detections && detections.length > 0) {
      for (let i = 0; i < detections.length; i++) {
        const landmarks = detections[i].landmarks.positions;

        // 얼굴 모양, 눈, 코, 입 랜드마크 추출
        const faceOutline = landmarks.slice(0, 17); // 얼굴 윤곽 (0~16)
        const leftEye = landmarks.slice(36, 42); // 왼쪽 눈 (36~41)
        const rightEye = landmarks.slice(42, 48); // 오른쪽 눈 (42~47)
        const nose = landmarks.slice(27, 36); // 코 (27~35)
        const mouth = landmarks.slice(48, 68); // 입 (48~67)

        // 각 랜드마크 데이터를 배열에 추가
        addFeature(faceOutline, currentTime, color(0, 255, 0)); // 초록색 얼굴 윤곽
        addFeature(leftEye, currentTime, color(255, 0, 0)); // 빨간색 왼쪽 눈
        addFeature(rightEye, currentTime, color(255, 0, 0)); // 빨간색 오른쪽 눈
        addFeature(nose, currentTime, color(0, 0, 255)); // 파란색 코
        addFeature(mouth, currentTime, color(255, 255, 0)); // 노란색 입
      }
    }
  }

  // 랜드마크를 렌더링하고 오래된 데이터 제거
  updateAndDrawFeatures(currentTime);
}

// 새로운 랜드마크 데이터를 배열에 추가
function addFeature(points, currentTime, featureColor) {
  facialFeatures.push({
    points: points, // 랜드마크 좌표
    createdAt: currentTime, // 생성된 시간
    color: featureColor, // 랜드마크의 색상
  });
}

// 랜드마크를 렌더링하고 오래된 데이터 제거
function updateAndDrawFeatures(currentTime) {
  noFill();

  for (let i = facialFeatures.length - 1; i >= 0; i--) {
    const feature = facialFeatures[i];
    const age = currentTime - feature.createdAt; // 랜드마크의 나이

    // 수명을 초과한 랜드마크 제거
    if (age > featureLifespan) {
      facialFeatures.splice(i, 1);
      continue;
    }

    // 랜드마크의 투명도 계산 (시간에 따라 점점 사라짐)
    const alpha = map(age, 0, featureLifespan, 255, 0);

    // 랜드마크를 그리기
    stroke(
      feature.color.levels[0],
      feature.color.levels[1],
      feature.color.levels[2],
      alpha
    );
    strokeWeight(2);
    beginShape();
    for (let point of feature.points) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }
}
