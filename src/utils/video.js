let video;
let faceapi;
let detections = [];

function initializeVideo() {
  video = createCapture(VIDEO); // 웹캠 비디오 캡처
  video.size(640, 480); // 비디오 크기 설정
  video.hide(); // 비디오를 HTML에서 숨기고 캔버스에서만 출력
}

function initializeFaceAPI(callback) {
  const faceOptions = { withLandmarks: true, withDescriptors: false };
  faceapi = ml5.faceApi(video, faceOptions, callback); // FaceAPI 초기화
}

function detectFaces() {
  faceapi.detect((err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    detections = result; // 감지된 얼굴 데이터 저장
    detectFaces(); // 지속적인 감지
  });
}

export { initializeVideo, initializeFaceAPI, detectFaces };