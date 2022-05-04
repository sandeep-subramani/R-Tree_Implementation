const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const RBush = window.rbush;
const tree = new RBush();

let count = 0;
let bulkBoxArray = [];

function drawBox(color, x, y, w, h) {
  let box = {};
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, w, h);
  box.minX = x;
  box.minY = y;
  box.maxX = x + w;
  box.maxY = y + h;
  box.id = count++;
  box.color = color;
  bulkBoxArray.push(box);
}

function bulkBoxMaker(color1, range) {
  bulkBoxArray = [];
  let count = 50;
  const getRandom = () => (Math.random() * range) | 0;
  while (count--) {
    drawBox(color1, getRandom(), getRandom(), getRandom(), getRandom());
  }
  tree.load(bulkBoxArray);
}

bulkBoxMaker("red", 600);
bulkBoxMaker("blue", 500);
bulkBoxMaker("green", 400);

function topObjPicker(allObj) {
  let op = { id: Number.MIN_SAFE_INTEGER };
  for (let i = 0; i < allObj.length; i++) {
    if (op.id < allObj[i].id) {
      op = allObj[i];
    }
  }
  return op;
}

function getMouseCoordinates(canvasElem, evt) {
  let outermostBorder = canvasElem.getBoundingClientRect();
  let x = Math.abs(evt.clientX - outermostBorder.left);
  let y = Math.abs(evt.clientY - outermostBorder.top);
  return [x, y];
}

let currentObject = { id: Number.MIN_SAFE_INTEGER };

function boxHighlighter(evt) {
  let x = getMouseCoordinates(canvas, evt)[0];
  let y = getMouseCoordinates(canvas, evt)[1];
  let onMouseObjects = tree.search({
    minX: x,
    minY: y,
    maxX: x,
    maxY: y,
  });
  if (onMouseObjects.length > 0) {
    if (currentObject.id == Number.MIN_SAFE_INTEGER) {
      currentObject = topObjPicker(onMouseObjects);
      ctx.fillStyle = currentObject.color;
      ctx.fillRect(
        currentObject.minX,
        currentObject.minY,
        currentObject.maxX - currentObject.minX,
        currentObject.maxY - currentObject.minY
      );
    } else if (currentObject.id != topObjPicker(onMouseObjects).id) {
      ctx.clearRect(
        currentObject.minX,
        currentObject.minY,
        currentObject.maxX - currentObject.minX,
        currentObject.maxY - currentObject.minY
      );
      tree.search(currentObject).forEach((element) => {
        ctx.strokeStyle = element.color;
        ctx.strokeRect(
          element.minX,
          element.minY,
          element.maxX - element.minX,
          element.maxY - element.minY
        );
      });
      currentObject = topObjPicker(onMouseObjects);
      ctx.fillStyle = currentObject.color;
      ctx.fillRect(
        currentObject.minX,
        currentObject.minY,
        currentObject.maxX - currentObject.minX,
        currentObject.maxY - currentObject.minY
      );
    }
  } else {
    if (currentObject.id != Number.MIN_SAFE_INTEGER) {
      tree.search(currentObject).forEach((element) => {
        if (element.id == currentObject.id) {
          ctx.clearRect(
            element.minX,
            element.minY,
            element.maxX - element.minX,
            element.maxY - element.minY
          );
          tree.search(element).forEach((element2) => {
            ctx.strokeStyle = element2.color;
            ctx.strokeRect(
              element2.minX,
              element2.minY,
              element2.maxX - element2.minX,
              element2.maxY - element2.minY
            );
          });
        }
      });
    }
    currentObject = { id: Number.MIN_SAFE_INTEGER };
  }
}
