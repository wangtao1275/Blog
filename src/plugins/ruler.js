export default class Ruler {
  constructor(config) {
    this.cfg = Object.assign({
      el: '',
        type: 'x',
        zoom: 1,
        width: 1920,
        height: 20,
        unit: 50,
        style: { width: '100%', height: '100%' },
        backgroundColor: '#ffffff',
        lineColor: '#777777',
        textColor: '#777777'
    }, config);
    this.state = {
      scrollPos: 0
    };
    this.drawElement = null;
    this.canvasElement = null;
    this.canvasContext = null;
    this.width = 0;
    this.height = 0;
  }

  run(){
    this.drawElement = document.querySelector('#'+this.cfg.el);
    this.canvasElement = document.createElement('canvas');

    let canvas = this.canvasElement;
    let context = canvas.getContext('2d');
    this.canvasContext = context;
    this.resize();
    this.drawElement.append(canvas);
    return this;

  }

  resize(){
    let canvas = this.canvasElement;
    let { width, height } = this.cfg;
    this.width = width || canvas.offsetWidth;
    this.height = height || canvas.offsetHeight;

    canvas.width = this.width * 2;
    canvas.height = this.height * 2;
    this.draw();
    return this;
  }

  draw(scrollPos = this.state.scrollPos) {
    let { unit, zoom, type, backgroundColor, lineColor, textColor } = this.cfg;
    let width = this.width;
    let height = this.height;
    let state = this.state;
    state.scrollPos = scrollPos;
    let context = this.canvasContext;

    let isX = type === 'x';

    context.fillStyle = backgroundColor;
    context.fill();
    context.save();
    context.scale(2, 2);
    context.strokeStyle = lineColor;
    context.lineWidth = 1;
    context.font = '10px sans-serif';
    context.fillStyle = textColor;

    if (isX) {
      context.rect(0, 0, width * 4, height * 4);
      context.translate(0.5, 0);
    } else {
      context.rect(0, 0, height * 4, width * 4);
      context.translate(0, 0.5);
    }
    context.beginPath();

    let size = (isX ? width : height) * 4;
    let zoomUnit = zoom * unit;
    let minRange = Math.floor((scrollPos * zoom) / zoomUnit);
    let maxRange = Math.ceil((scrollPos * zoom + size) / zoomUnit);
    let length = maxRange - minRange;

    for (let i = 0; i < length; ++i) {
      let startPos = ((i + minRange) * unit - scrollPos) * zoom;

      if (startPos >= -zoomUnit && startPos < size) {
        let startX = isX ? startPos + 3 : width - 12;
        let startY = isX ? height - 12 : startPos - 4;

        if (isX) {
          context.fillText(`${(i + minRange) * unit}`, startX, startY);
        } else {
          context.save();
          context.translate(startX, startY);
          context.rotate(-Math.PI / 2);
          context.fillText(`${(i + minRange) * unit}`, 0, 0);
          context.restore();
        }
      }

      for (let j = 0; j < 10; ++j) {
        let pos = startPos + (j / 10) * zoomUnit;
        if (pos < 0 || pos >= size) {
          continue;
        }
        let lineSize = j === 0 ? (isX ? height : width) : j % 2 === 0 ? 10 : 5;

        let x1 = isX ? pos : width - lineSize;
        let y1 = isX ? height - lineSize : pos;
        let x2 = isX ? pos : width;
        let y2 = isX ? height : pos;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
      }
    }
    context.stroke();
    context.restore();

    return this;


  }
}
