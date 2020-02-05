import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class Waves extends Component {
  constructor(props) {
    super(props);

    this.DOT_GAP = 50;
    this.DOT_RADIUS = 0.5;
    this.CIRCLE_RADIUS = 50;
    this.WAVES = 10;
    this.SPEED = 1;
    this.BG_COLOR = '#3d5afe';
    this.DOT_COLOR = '#ffffff';

    this.createOffScreenCanvas = this.createOffScreenCanvas.bind(this);
    this.drawDot = this.drawDot.bind(this);
    this.draw = this.draw.bind(this);
    this.resize = this.resize.bind(this);
    this.setStartPosition = this.setStartPosition.bind(this);
    this.setBgColor = this.setBgColor.bind(this);
  }

  componentDidMount() {
    this.createOffScreenCanvas();

    this.ctx = this.cv.getContext('2d');

    this.setBgColor();

    this.angleDeg = 0;
    this.angleRad = 0;

    window.addEventListener('resize', this.resize);

    this.resize();
    this.draw();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
  }

  setStartPosition() {
    for (let i = this.center.x; i > 0; i -= this.DOT_GAP) {
      this.startX = i - this.DOT_RADIUS - this.DOT_GAP;
    }

    for (let i = this.center.y; i > 0; i -= this.DOT_GAP) {
      this.startY = i - this.DOT_RADIUS - this.DOT_GAP;
    }
  }

  setBgColor() {
    this.mainCont.style.backgroundColor = this.BG_COLOR;
  }

  createOffScreenCanvas() {
    this.osCv = document.createElement('canvas');
    this.osCtx = this.osCv.getContext('2d');

    this.osDotCv = document.createElement('canvas');
    this.osDotCtx = this.osDotCv.getContext('2d');

    this.drawDot();
  }

  drawDot() {
    this.osDotCv.width = this.DOT_RADIUS * 2;
    this.osDotCv.height = this.DOT_RADIUS * 2;

    this.osDotCtx.clearRect(0, 0, this.DOT_RADIUS * 2, this.DOT_RADIUS * 2);
    this.osDotCtx.beginPath();
    this.osDotCtx.fillStyle = this.DOT_COLOR;
    this.osDotCtx.arc(this.DOT_RADIUS, this.DOT_RADIUS, this.DOT_RADIUS, 0, Math.PI * 2);
    this.osDotCtx.fill();
  }

  draw() {
    this.animationFrame = window.requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    this.osCtx.clearRect(0, 0, this.osCv.width, this.osCv.height);

    this.angleDeg = this.angleDeg + this.SPEED < 360
      ? this.angleDeg + this.SPEED
      : this.angleDeg + this.SPEED - 360;
    this.angleDeltaXDeg = 0;
    this.angleDeltaYDeg = 0;

    for (let j = this.startY; j < this.windowSize.h + this.DOT_GAP; j += this.DOT_GAP) {
      this.angleDeltaYDeg += this.WAVES;
      this.angleDeltaXDeg = this.angleDeltaYDeg;

      for (let i = this.startX; i < this.windowSize.w + this.DOT_GAP; i += this.DOT_GAP) {
        this.angleDeltaXDeg += this.WAVES;
        this.angleRad = (this.angleDeg + this.angleDeltaXDeg) * Math.PI / 180;

        const x = Math.cos(this.angleRad) * this.CIRCLE_RADIUS + i;
        const y = Math.sin(this.angleRad) * this.CIRCLE_RADIUS + j;

        this.osCtx.drawImage(
          this.osDotCv,
          0,
          0,
          this.DOT_RADIUS * 2,
          this.DOT_RADIUS * 2,
          x,
          y,
          this.DOT_RADIUS * 2,
          this.DOT_RADIUS * 2,
        );
      }
    }

    this.ctx.drawImage(
      this.osCv,
      0,
      0,
      this.windowSize.w,
      this.windowSize.h,
      0,
      0,
      this.windowSize.w,
      this.windowSize.h,
    );
  }

  resize() {
    this.windowSize = {
      w: window.innerWidth,
      h: window.innerHeight,
    };

    this.center = {
      x: Math.round(this.windowSize.w / 2),
      y: Math.round(this.windowSize.h / 2),
    };

    this.cv.width = this.windowSize.w;
    this.cv.height = this.windowSize.h;
    this.osCv.width = this.windowSize.w;
    this.osCv.height = this.windowSize.h;

    this.setStartPosition();
  }

  render() {
    return (
      <section ref={(el) => { this.mainCont = el; }} className="fill bg-primary">
        <canvas ref={(el) => { this.cv = el; }} />
      </section>
    );
  }
}

Waves.defaultProps = {
};

Waves.propTypes = {
};

export default Waves;
