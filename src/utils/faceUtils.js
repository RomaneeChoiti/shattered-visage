export function setTargetBlobPositionAndColor(
  landmarks,
  faceOutline,
  mouth,
  leftEye,
  rightEye,
  nose
) {
  // 중앙 위치 및 반지름 설정
  const centerX = width / 2;
  const centerY = height / 2;
  const radius =
    dist(
      faceOutline[0].x,
      faceOutline[0].y,
      faceOutline[16].x,
      faceOutline[16].y
    ) / 2;
  targetRadius = radius;

  // 움직임 감지: 현재와 이전 랜드마크 비교
  if (previousLandmarks.length > 0) {
    movementMagnitude = 0;
    for (let i = 0; i < landmarks.length; i++) {
      let dx = landmarks[i].x - previousLandmarks[i].x;
      let dy = landmarks[i].y - previousLandmarks[i].y;
      movementMagnitude += sqrt(dx * dx + dy * dy);
    }
    movementMagnitude /= landmarks.length; // 평균 변화량
  }

  // 변화량을 색상에 매핑
  const mappedRed = map(movementMagnitude, 0, 10, 50, 255, true);
  const mappedGreen = map(movementMagnitude, 0, 10, 150, 50, true);
  const mappedBlue = map(movementMagnitude, 0, 10, 255, 100, true);

  targetColor = color(mappedRed, mappedGreen, mappedBlue);

  // 현재 랜드마크를 이전 랜드마크로 저장
  previousLandmarks = landmarks.map((landmark) => ({
    x: landmark.x,
    y: landmark.y,
  }));
}
