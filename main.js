const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const RBush = window.rbush;
const tree = new RBush();

let boxes = new Array();

function drawBox(x, y, w, h, string) {
  boxes = [];
  let boxWidth = w / 10;
  let boxHeight = h / 10;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ctx.strokeRect(x + boxWidth * i, y + boxHeight * j, boxWidth, boxHeight);
      boxes.push({
        minX: x + boxWidth * i,
        minY: y + boxHeight * j,
        maxX: x + boxWidth * i + boxWidth,
        maxY: y + boxHeight * j + boxHeight,
        info: string + ` ID ${i + 1},${j + 1}`,
      });
    }
  }
  tree.load(boxes);
}
drawBox(0, 0, 600, 600, 1);
drawBox(100, 100, 400, 400, 2);
drawBox(200, 200, 200, 200, 3);
drawBox(0, 0, 300, 300, 4);

function getMouseCoordinates(canvasElem, evt) {
  let outermostBorder = canvasElem.getBoundingClientRect();
  let x = Math.abs(evt.clientX - outermostBorder.left);
  let y = Math.abs(evt.clientY - outermostBorder.top);
  return [x, y];
}
function displayDetails(evt) {
  console.log(
    tree.search({
      minX: getMouseCoordinates(canvas, evt)[0],
      minY: getMouseCoordinates(canvas, evt)[1],
      maxX: getMouseCoordinates(canvas, evt)[0],
      maxY: getMouseCoordinates(canvas, evt)[1],
    })[0].info
  );
}
