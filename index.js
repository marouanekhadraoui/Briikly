const toolbarToggle = document.getElementById('toggle-toolbar');
const shapeToolbar = document.getElementById('shape-toolbar');
const canvas = document.getElementById('canvas');
const undoStack = [];
const redoStack = [];

toolbarToggle.addEventListener('click', () => {
  shapeToolbar.style.display = shapeToolbar.style.display === 'flex' ? 'none' : 'flex';
});


document.querySelectorAll('.tool-item').forEach(item => {
  item.setAttribute('draggable', true);
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('shape', item.dataset.shape);
  });
});


canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
  e.preventDefault();
  const shape = e.dataTransfer.getData('shape');
  const el = createShape(shape, e.offsetX, e.offsetY);
  saveState();
  canvas.appendChild(el);
});

function createBaseShape(x, y) {
  const shape = document.createElement('div');
  shape.classList.add('shape');
  shape.style.position = 'absolute';
  shape.style.left = x + 'px';
  shape.style.top = y + 'px';
  shape.style.width = '100px';
  shape.style.height = '100px';
  shape.style.background = '#ccc';
  shape.style.border = '1px solid #000';
  shape.style.borderRadius = '0';
  shape.style.cursor = 'move';
  shape.setAttribute('tabindex', 0);


  shape.addEventListener('click', () => selectShape(shape));
  makeResizable(shape);
  makeDraggable(shape);
  return shape;
}


function createShape(type, x, y) {
  const el = document.createElement('div');
  el.classList.add('shape');
  el.style.position = 'absolute';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.background = '#ccc';
  el.style.border = '1px solid #000';
  el.setAttribute('tabindex', 0);

  switch (type) {
    case 'circle':
      el.style.borderRadius = '50%';
      break;
    case 'triangle':
      el.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      el.style.background = '#345';
      break;
    case 'line':
      el.style.height = '2px';
      el.style.background = '#000';
      break;
    case 'ellipse':
      el.style.borderRadius = '50% / 25%';
      break;
    case 'star':
      el.innerHTML = '★';
      el.style.textAlign = 'center';
      el.style.fontSize = '40px';
      el.style.background = 'transparent';
      el.style.border = 'none';
      break;
  }

  el.addEventListener('click', () => selectShape(el));
  makeResizable(el);
  return el;
}

function selectShape(el) {
  document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');

  document.getElementById('width').value = parseInt(el.style.width);
  document.getElementById('height').value = parseInt(el.style.height);
  document.getElementById('x').value = parseInt(el.style.left);
  document.getElementById('y').value = parseInt(el.style.top);
  document.getElementById('bg-color').value = rgb2hex(el.style.backgroundColor);
  document.getElementById('border').value = parseInt(el.style.borderWidth || '1');
  document.getElementById('radius').value = parseInt(el.style.borderRadius || '0');
  document.getElementById('font-size').value = parseInt(el.style.fontSize || '16');
  document.getElementById('font-color').value = rgb2hex(el.style.color || '#000');
  document.getElementById('opacity').value = el.style.opacity || 1;
  document.getElementById('rotation').value = el.style.transform?.match(/\d+/)?.[0] || 0;
}


function rgb2hex(rgb) {
  if (!rgb) return '#cccccc';
  const result = rgb.match(/\d+/g)?.map(x => (+x).toString(16).padStart(2, '0'));
  return result ? `#${result.join('')}` : '#cccccc';
}


function updateStyle(prop, val) {
  const el = document.querySelector('.shape.selected');
  if (!el) return;
  if (prop === 'transform') el.style[prop] = `rotate(${val}deg)`;
  else el.style[prop] = val;
  saveState();
}


['width','height','x','y','bg-color','border','radius','font-size','font-color','opacity','rotation']
.forEach(id => {
  const propMap = {
    'bg-color': 'background',
    'border': 'border',
    'radius': 'borderRadius',
    'font-size': 'fontSize',
    'font-color': 'color',
    'opacity': 'opacity',
    'rotation': 'transform',
    'x': 'left',
    'y': 'top'
  };
  document.getElementById(id).addEventListener('input', e => {
    const value = (id === 'border') ? `${e.target.value}px solid #000` :
                  (['x','y','width','height','radius','font-size'].includes(id)) ? `${e.target.value}px` :
                  e.target.value;
    updateStyle(propMap[id] || id, value);
  });
});


document.addEventListener('keydown', (e) => {
  const selected = document.querySelector('.shape.selected');
  if (!selected) return;

  const step = 5;
  const keyMap = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step]
  };
  if (e.key in keyMap) {
    const [dx, dy] = keyMap[e.key];
    selected.style.left = `${parseInt(selected.style.left) + dx}px`;
    selected.style.top = `${parseInt(selected.style.top) + dy}px`;
    saveState();
    selectShape(selected);
  }

  
  const shortCuts = { 'r': 'rect', 'c': 'circle', 'l': 'line', 't': 'triangle', 'e': 'ellipse', 's': 'star' };
  if (e.key in shortCuts) {
    const el = createShape(shortCuts[e.key], 100, 100);
    canvas.appendChild(el);
    saveState();
  }

 
  if (e.ctrlKey && e.key === 'z') undo();
  if (e.ctrlKey && e.key === 'y') redo();
});


function saveState() {
  undoStack.push(canvas.innerHTML);
  redoStack.length = 0; 
}
function undo() {
  if (!undoStack.length) return;
  redoStack.push(canvas.innerHTML);
  canvas.innerHTML = undoStack.pop();
  rebindAll();
}
function redo() {
  if (!redoStack.length) return;
  undoStack.push(canvas.innerHTML);
  canvas.innerHTML = redoStack.pop();
  rebindAll();
}


function rebindAll() {
  canvas.querySelectorAll('.shape').forEach(shape => {
    shape.addEventListener('click', () => selectShape(shape));
    makeResizable(shape);
    makeDraggable(shape);
  });
}


function makeResizable(el) {
  const resizer = document.createElement('div');
  resizer.classList.add('resizer');
  el.appendChild(resizer);

  resizer.addEventListener('mousedown', startResize);

  function startResize(e) {
    e.preventDefault();
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  }

  function resize(e) {
    const rect = el.getBoundingClientRect();
    el.style.width = e.clientX - rect.left + 'px';
    el.style.height = e.clientY - rect.top + 'px';
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
    saveState();
  }
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('resizer')) return; 
    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - offsetX;
    const newY = e.clientY - canvasRect.top - offsetY;

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';

   
    if (el.classList.contains('selected')) {
      document.getElementById('x').value = parseInt(el.style.left);
      document.getElementById('y').value = parseInt(el.style.top);
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      saveState(); 
    }
  });
}

const el = createBaseShape(100, 100);
canvas.appendChild(el);
makeResizable(el); 
makeDraggable(el); 
el.addEventListener('click', () => selectShape(el));

['x', 'y', 'width', 'height', 'bg-color', 'border', 'radius', 'font-size', 'font-color', 'opacity', 'rotation']
.forEach(id => {
  document.getElementById(id).addEventListener('input', updateStyleFromPanel);
});

selectedEl.style.left = document.getElementById('x').value + "px";
selectedEl.style.top  = document.getElementById('y').value + "px";

let zoomLevel = 1;
const zoomStep = 0.1;
const minZoom = 0.3;
const maxZoom = 3;


canvas.addEventListener('wheel', (e) => {
  e.preventDefault();

  
  if (e.deltaY < 0) {
    
    zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom);
  } else {
    
    zoomLevel = Math.max(zoomLevel - zoomStep, minZoom);
  }

  
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "0 0"; 
}, { passive: false });

const zoomInButton = document.createElement('button');
zoomInButton.textContent = '+';
zoomInButton.id = 'zoom-in';
const zoomOutButton = document.createElement('button');
zoomOutButton.textContent = '-';
zoomOutButton.id = 'zoom-out';
document.body.appendChild(zoomInButton);
document.body.appendChild(zoomOutButton);

zoomInButton.addEventListener('click', () => {
  zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom);
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "0 0";
});
zoomOutButton.addEventListener('click', () => {
  zoomLevel = Math.max(zoomLevel - zoomStep, minZoom);
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "0 0";
});


const resetZoomButton = document.createElement('button');
resetZoomButton.textContent = 'Reset Zoom';
resetZoomButton.id = 'reset-zoom';
document.body.appendChild(resetZoomButton);
resetZoomButton.addEventListener('click', () => {
  zoomLevel = 1;
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "0 0";
});


const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.id = 'save';
document.body.appendChild(saveButton);
saveButton.addEventListener('click', () => {
  const data = canvas.innerHTML;
  const blob = new Blob([data], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'canvas.html';
  a.click();
  URL.revokeObjectURL(url);
});

const loadButton = document.createElement('button');
loadButton.textContent = 'Load';
loadButton.id = 'load';
document.body.appendChild(loadButton);
loadButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.html';
  input.onchange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        canvas.innerHTML = event.target.result;
        rebindAll(); 
      };
      reader.readAsText(file);
    }
  };
  input.click();
});

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.id = 'delete';
document.body.appendChild(deleteButton);
deleteButton.addEventListener('click', () => {
  const selected = document.querySelector('.shape.selected');
  if (selected) {
    selected.remove();
    selectedEl = null; 
    document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
  }
});

const bgColorButton = document.createElement('button');
bgColorButton.textContent = 'Change Background Color';
bgColorButton.id = 'bg-color-button';
document.body.appendChild(bgColorButton);
bgColorButton.addEventListener('click', () => {
  const color = prompt('Enter background color (hex or rgb):', '#ffffff');
  if (color) {
    canvas.style.backgroundColor = color;
  }
});

const toolText = document.getElementById('tool-text');
const fontSizeInput = document.getElementById('font-size');
const fontColorInput = document.getElementById('font-color');
const bgColorInput = document.getElementById('bg-color');
const propertiesPanel = document.querySelector('.properties-panel');

let isTextMode = false;
let selectedTextElement = null;


toolText.addEventListener('click', () => {
  isTextMode = true;
  canvas.style.cursor = 'text';
});


document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't') {
    isTextMode = true;
    canvas.style.cursor = 'text';
  }
});


canvas.addEventListener('click', (e) => {
  if (!isTextMode) return;

  const textElement = document.createElement('div');
  textElement.contentEditable = true;
  textElement.textContent = 'Type here...';
  textElement.style.position = 'absolute';
  textElement.style.left = `${e.offsetX}px`;
  textElement.style.top = `${e.offsetY}px`;
  textElement.style.fontSize = fontSizeInput.value + 'px';
  textElement.style.color = fontColorInput.value;
  textElement.style.backgroundColor = bgColorInput.value;
  textElement.style.padding = '4px 6px';
  textElement.style.border = '1px dashed #ccc';
  textElement.style.cursor = 'text';

  textElement.classList.add('canvas-text');
  canvas.appendChild(textElement);

  isTextMode = false;
  canvas.style.cursor = 'default';

  selectTextElement(textElement);
});


canvas.addEventListener('click', (e) => {
  if (e.target.classList.contains('canvas-text')) {
    selectTextElement(e.target);
  }
});

function selectTextElement(element) {
  selectedTextElement = element;
  fontSizeInput.value = parseInt(window.getComputedStyle(element).fontSize);
  fontColorInput.value = rgbToHex(window.getComputedStyle(element).color);
  bgColorInput.value = rgbToHex(window.getComputedStyle(element).backgroundColor);
  propertiesPanel.scrollIntoView({ behavior: 'smooth' });
}


fontSizeInput.addEventListener('input', () => {
  if (selectedTextElement)
    selectedTextElement.style.fontSize = fontSizeInput.value + 'px';
});

fontColorInput.addEventListener('input', () => {
  if (selectedTextElement)
    selectedTextElement.style.color = fontColorInput.value;
});

bgColorInput.addEventListener('input', () => {
  if (selectedTextElement)
    selectedTextElement.style.backgroundColor = bgColorInput.value;
});


function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return result && result.length >= 3
    ? '#' + result.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('')
    : '#000000'; 
}
