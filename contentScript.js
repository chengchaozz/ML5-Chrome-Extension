// const video = document.getElementById('video');

// // Create a new poseNet method
// console.log('ml5:', ml5);
// const poseNet = ml5.poseNet(video, modelLoaded);

// // When the model is loaded
// function modelLoaded() {
//   console.log('Model Loaded!');
// }
// // Listen to new 'pose' events
// poseNet.on('pose', function (results) {
//   poses = results;
// });
var BORDER_STYLE = "1px solid #bbb",
  CSS_TRANSFORM = null,
  CSS_TRANSFORM_ORIGIN = null,
  POSSIBLE_TRANSFORM_PREFIXES = ['-webkit-', '-moz-', '-o-', '-ms-', ''],
  khFirst = false;
let video;
let poseNet;
let poses = [];
let lefteyeX = 0;
let lefteyeY = 0;
let plefteyeX = 0;
let plefteyeY = 0;
let skeletons = [];
let dx = 0;
let dy = 0;
let count = 0;
let originx = 0;
let originy = 0;
let move = false;
let active = false;
function setup() {

  let ca = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  ca.style('display', 'block');
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  //select('#status').html('Model Loaded');
}
//$('body').css({ 'background-color': 'black' });

function draw() {
  //image(video, 0, 0, width, height);
  //console.log(poses[0].pose.keypoints[1]);
  background(255);
  //console.log(lefteyeX - plefteyeX);
  // We can call both functions to draw all keypoints and the skeletons
  //debugger;
  // if (lefteyeX - plefteyeX < 5 && lefteyeX - plefteyeX > -5) {
  //   dx = dy = 0;
  // } else {
  //   dx = lefteyeX - plefteyeX;
  //   dy = lefteyeY - plefteyeY;
  // }
  if (active) {
    count++;
    if (count < 100) {
      if (lefteyeX == 0 && lefteyeY == 0) {

      } else {
        originx = lefteyeX;
        originy = lefteyeY;
      }
    } else if (plefteyeX - lefteyeX > 5 || plefteyeX - lefteyeX < -5) {
      //dx = lefteyeX - originx;

      move = true;
    }
    if (move) {
      dy = lefteyeY - originy;
      dx += 1;
    }
    console.log(plefteyeX - lefteyeX);
    stroke(10);
    line(originx, originy, lefteyeX, lefteyeY);
    // $('b').css('textShadow', `${dx}px ${dy}px 0px`);
    // $('p').css('textShadow', `${-dx}px ${dy}px 0px`);
    // $('li').css('textShadow', `${dx}px ${-dy}px 0px`);
    $('b').css({ top: dx, left: dy, position: 'relative' });
    $('p').css({ top: -dx, left: dy, position: 'relative' });
    $('li').css({ top: dx, left: -dy, position: 'relative' });
    $('h3').css({ top: dy, left: -dx, position: 'relative' });
    $('span').css({ top: dy, left: -dx, position: 'relative' });
    $('br').css({ top: -dy, left: -dx, position: 'relative' });
    //$('p').css({ top: 200, left: 200, position: 'absolute' });
    //$('img').css('textShadow', `${-dx}px ${-dy}px 0px`);
    plefteyeX = lefteyeX;
    plefteyeY = lefteyeY;
  }

  drawKeypoints();
  //drawSkeleton();
}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {

      active = true;


    }
  }
);
function getCssTransform() {
  var i, d = document.createElement('div'), pre;
  for (i = 0; i < POSSIBLE_TRANSFORM_PREFIXES.length; i++) {
    pre = POSSIBLE_TRANSFORM_PREFIXES[i];
    d.style.setProperty(pre + 'transform', 'rotate(1rad) scaleX(2)', null);
    if (d.style.getPropertyValue(pre + 'transform')) {
      CSS_TRANSFORM = pre + 'transform';
      CSS_TRANSFORM_ORIGIN = pre + 'transform-origin';
      return;
    }
  }
  alert("Your browser doesn't support CSS tranforms!");
  throw "Your browser doesn't support CSS tranforms!";
}
getCssTransform();
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[0].pose.keypoints[1];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        lefteyeX = keypoint.position.x;
        lefteyeY = keypoint.position.y;
        //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
