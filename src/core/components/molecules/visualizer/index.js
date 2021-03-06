/* eslint-disable max-len */
import React, { Component } from 'react';
import * as THREE from 'three';
import { tween } from 'shifty';
import PropTypes from 'prop-types';
import $ from '../../../helpers/helper-jquery';
// import requestAnimationFrame from './requestAnimationFrame';

import './style.scss';

import loopVisualizer from './visualizer';

class Visualizer extends Component {
  constructor(props) {
    super(props);
    // Chrome is only browser to currently support Web Audio API
    const isWebgl = (() => {
      try {
        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
      } catch (e) {
        return false;
      }
    })();

    this.state = {
      isWebgl,
    };
    const rect = 

    this.mouseX = 0;
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.visualizer = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.container = null;
    this.source = null;
    this.analyser = null;
    this.audioContext = null;
    this.started = false;
    this.mic = false;

    this.onDocMouseMove = this.onDocMouseMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentDrop = this.onDocumentDrop.bind(this);
    this.createAudio = this.createAudio.bind(this);
    this.initAudio = this.initAudio.bind(this);
    this.initMic = this.initMic.bind(this);
    this.animate = this.animate.bind(this);
    this.onInit = this.onInit.bind(this);
  }

  componentDidMount() {
    const {
      setRef,
    } = this.props;
    const {
      isWebgl,
    } = this.state;
    setRef(this);
    const rect = this.container.getBoundingClientRect();
    const max = Math.max(rect.width, rect.height);
    this.windowHalfX = max / 2;
    this.windowHalfY = max / 2;
    if (!isWebgl) {
      this.container.innerHTML = 'Your graphics card does not seem to support WebGL';
      return;
    }

    document.onselectStart = () => false;

    document.addEventListener('drop', this.onDocumentDrop, false);
    document.addEventListener('dragover', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }, false);

    this.onInit();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onDocMouseMove, false);
    window.removeEventListener('resize', this.onWindowResize, false);
    document.removeEventListener('drop', this.onDocumentDrop, false);
  }

  onInit() {
    const rect = this.container.getBoundingClientRect();
    const max = Math.max(rect.width, rect.height);
    this.windowHalfX = max / 2;
    this.windowHalfY = max / 2;
    // init 3D scene
    // this.camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 1, 1000000);
    this.camera = new THREE.PerspectiveCamera(60, 1, 1, 1000000);
    this.camera.position.z = 300;
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // sortObjects: false,
      alpha: true,
    });
    this.renderer.setSize(max, max);
    // this.renderer.setSize(rect.width, rect.height);
    // this.renderer.setClearColor(new THREE.Color(0x0000FF));
    this.renderer.setClearColor(new THREE.Color(0x000000), 0.0);

    this.container.appendChild(this.renderer.domElement);

    // stop the user getting a text cursor

    $(document).mouseleave(() => {
      tween({
        from: { x: this.mouseX, y: this.mouseY },
        to: { x: -0.5, y: -0.5 },
        duration: 1500,
        easing: 'easeOutQuad',
        step: (state) => {
          this.mouseX = state.x;
          this.mouseY = state.y;
        },
      });
      // .then(
      //   () => console.log('All done!'),
      // );
    });

    document.addEventListener('mousemove', this.onDocMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);

    this.onWindowResize(null);
    // this.initMic();
  }

  onWindowResize() {
    const rect = this.container.getBoundingClientRect();
    const max = Math.max(rect.width, rect.height);
    this.windowHalfX = max / 2;
    this.windowHalfY = max / 2;
    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(max, max);
    // this.windowHalfX = rect.width / 2;
    // this.windowHalfY = rect.height / 2;
    // this.camera.aspect = rect.width / rect.height;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(rect.width, rect.height);
  }

  onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // clean up previous mp3
    if (this.source) {
      this.source.disconnect();
      this.visualizer.remove();
    }

    // $('#loading').show();
    // $('#loading').text('loading...');

    const droppedFiles = evt.dataTransfer.files;

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const data = target.result;
      this.initAudio(data);
    };

    reader.readAsArrayBuffer(droppedFiles[0]);
  }

  onDocMouseMove({ clientX, clientY }) {
    this.mouseX = (clientX - this.windowHalfX) * -0.5;
    this.mouseY = (clientY - this.windowHalfY) * -0.5;
  }

  createAudio() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.1;
    this.source.connect(this.analyser);
    // source.loop = true;

    this.startViz();
  }

  startViz() {
    console.log('loaded');
    const {
      onStart,
    } = this.props;

    this.visualizer = loopVisualizer(this.scene, this.analyser, this.mic);
    this.visualizer.init();

    if (!this.started) {
      this.started = true;
      this.animate();
      onStart();
    }
  }

  initAudio(data) {
    this.audioContext = new window.AudioContext();

    this.source = this.audioContext.createBufferSource();

    if (this.audioContext.decodeAudioData) {
      this.audioContext.decodeAudioData(
        data,
        (buffer) => {
          this.source.buffer = buffer;
          this.source.connect(this.audioContext.destination);
          this.source.start(0);
          this.mic = false;
          this.createAudio();
        },
        (e) => {
          console.log(e);
          console.log('cannot decode mp3');
        },
      );
    } else {
      this.source.buffer = this.audioContext.createBuffer(data, false);
      this.mic = false;
      this.createAudio();
    }
  }

  initMic() {
    if (this.source) {
      this.source.disconnect();
      this.visualizer.remove();
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        window.streamReference = stream;
        this.audioContext = new window.AudioContext();
        // const gainNode = context.createGain();

        this.source = this.audioContext.createMediaStreamSource(stream);
        this.mic = true;
        this.createAudio();
      });
  }

  animate() {
    // console.log('initMic', this.requestId);
    // requestAnimationFrame(this.animate);
    this.requestId = requestAnimationFrame(this.animate);
    // if (!this.requestId) {
    //   this.requestId = requestAnimationFrame(this.animate);
    // }
    this.visualizer.update();

    // mouse tilt
    // const xrot = this.mouseX / window.innerWidth * Math.PI + Math.PI;
    // const yrot = this.mouseY / window.innerHeight * Math.PI + Math.PI;
    // this.visualizer.loopHolder.rotation.x += (-yrot - this.visualizer.loopHolder.rotation.x) * 0.3;
    // this.visualizer.loopHolder.rotation.y += (xrot - this.visualizer.loopHolder.rotation.y) * 0.3;

    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    const {
      onEnd,
    } = this.props;
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
      this.started = false;
      this.visualizer.reset();
      this.renderer.render(this.scene, this.camera);
      if (this.source.stop) {
        this.source.stop(this.audioContext.currentTime + 1);
      }
      if (window.streamReference) {
        window.streamReference.getAudioTracks().forEach((track) => {
          track.stop();
        });

        window.streamReference.getVideoTracks().forEach((track) => {
          track.stop();
        });

        window.streamReference = null;
      }
      onEnd();
    }
  }

  render() {
    const {
      className,
    } = this.props;
    return (
      <div id="Visualizer" className={className} ref={(el) => { this.container = el; }} />
    );
  }
}

Visualizer.defaultProps = {
  setRef: () => {},
  onStart: () => {},
  onEnd: () => {},
  className: '',
};

Visualizer.propTypes = {
  setRef: PropTypes.func,
  onStart: PropTypes.func,
  onEnd: PropTypes.func,
  className: PropTypes.string,
};

export default Visualizer;
