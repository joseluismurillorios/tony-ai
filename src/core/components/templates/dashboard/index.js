/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
// import * as qs from 'query-string';

import Scrollable from '../../atoms/scrollable';

import { setLoader } from '../../../redux/actions/common';

import { Speech, SpeechRec } from '../../../helpers/helper-speech';
import { noteValues, arpeggiator } from '../../../helpers/helper-sound';

import Dropdown from '../../atoms/dropdown';
import Clock from '../../atoms/clock';
import Visualizer from '../../molecules/visualizer';
import CircularMenu from '../../molecules/circular-menu';
import Wow from '../../atoms/wow';

import './style.scss';
import Globe from '../../atoms/globe';

const chordSuccess = [
  noteValues.C5,
  // noteValues.E5,
  noteValues.F5,
];
const chordError = [
  noteValues.F4,
  // noteValues.E4,
  noteValues.A3,
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // const { location } = this.props;
    // const { search } = location;
    // const query = qs.parse(search, { ignoreQueryPrefix: true });

    this.state = {
      resultString: '',
      voices: [],
      selectedVoice: '',
      menuOpened: false,
      visual: false,
    };

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.onResult = debounce(this.onResult.bind(this), 1000);
    this.onLoad = this.onLoad.bind(this);
    this.onVoices = this.onVoices.bind(this);
    // this.startSpeaking = this.startSpeaking.bind(this);
    this.endSpeaking = this.endSpeaking.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onStart = this.onStart.bind(this);
    // this.onHashChanged = this.onHashChanged.bind(this);

    this.started = false;
  }

  componentDidMount() {
    const { loaderSet } = this.props;
    loaderSet('bg-gradient-02');
    setTimeout(() => {
      loaderSet(false);
    }, 500);
    this.wow = new window.WOW({
      offset: 50,
      mobile: false,
    });

    this.wow.init();
    this.speechRec = new SpeechRec('es-MX');
    this.speechRec.onStart = this.onStart;
    this.speechRec.onEnd = this.onEnd;
    this.speechRec.onResult = this.onResult;
    // this.speechRec.start(true, true);
    this.speech = new Speech(this.onLoad);
    // this.speech.started(this.startSpeaking);
    this.speech.ended(this.endSpeaking);
    // this.visualizer.initMic();
    window.addEventListener('hashchange', this.onHashChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChanged);
  }

  onLoad() {
    console.log('voice ready');
    const voices = this.speech.voices.filter(v => /^es-/.test(v.lang));
    this.speech.setVoice('Juan');
    this.setState({
      voices,
      selectedVoice: 'Juan',
    });
  }

  onVoices(e) {
    this.speech.setVoice(e.value);
    this.setState({
      selectedVoice: e.value,
    });
    this.speechRec.stop();
    this.text = `Hola ${e.value}`;
  }

  onResult({ resultString }) {
    console.log('result', resultString);
    this.setState({
      resultString,
    });
  }

  onStart() {
    console.log('started');
    if (!this.started) {
      arpeggiator(chordError, this.ctx);
      this.started = true;
    }
  }

  onEnd() {
    console.log('ended');
    if (this.text) {
      arpeggiator(chordSuccess, this.ctx);
      setTimeout(() => {
        this.speech.speak(this.text);
        this.text = undefined;
        this.started = false;
      }, 1000);
    } else {
      this.speechRec.start(true, true);
    }
  }

  // onHashChanged(e) {
  //   const { location } = this.props;
  //   const { search } = location;
  //   console.log(e);
  //   const query = qs.parse(search, { ignoreQueryPrefix: true });
  //   console.log(query);
  //   this.setState({
  //     modal: query.display || '',
  //   });
  // }

  // startSpeaking() {
  //   console.log('startSpeaking');
  //   // this.speechRec.stop();
  // }

  endSpeaking() {
    console.log('endSpeaking');
    setTimeout(() => { this.speechRec.start(true, true); }, 500);
  }

  render() {
    const { forecast } = this.props;
    const {
      // moonPhase,
      // earthPhase,
      // earthPhases,
      // moonPhases,
      moonCurrent,
      earthCurrent,
      moonPhaseName,
      earthPhaseName,
      weatherMetric,
      forecastList,
    } = forecast;
    const {
      resultString,
      voices,
      selectedVoice,
      menuOpened,
      visual,
    } = this.state;
    const items = voices.map(v => ({ id: v.name, name: v.name, lang: v.lang }));
    console.log(forecastList);
    const {
      icon,
      main: { temp },
      description,
    } = weatherMetric;
    return (
      <div
        id="Dashboard"
        className="app__page"
        ref={(el) => { this.container = el; }}
        disabled
      >
        <div id="DashboardPanel" className="dashboard">
          <div className="dashboard-left">
            <div className="dashboard-top">
              <div className="dashboard-item">
                <div className="dashboard-inner">
                  <div className="text-back">
                    <Clock noseconds format="A" />
                  </div>
                  <div className="text-front">
                    <Clock noseconds format="hh:mm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-bottom">
              <div className="dashboard-item">
                <div className="dashboard-inner">
                  <div className="text-back">
                    <span>C</span>
                  </div>
                  <div className="text-front">
                    <span>
                      {temp}
                      °
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-right">
            <div className="dashboard-top">
              <div className="dashboard-item">
                <div className="dashboard-inner">
                  <div className="text-back">
                    <span><i className={icon} /></span>
                  </div>
                  <div className="text-front">
                    <span className="capitalize">
                      {description}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-bottom">
              <div className="dashboard-left">
                <div className="dashboard-item">
                  <div className="dashboard-inner bg-dark">
                    <div className="text-back">
                      <Wow className="dashboard-box" show>
                        <Globe
                          id="MoonMain"
                          type="moon"
                          phase={moonCurrent}
                          size="168px"
                          // onClick={onClick}
                        />
                      </Wow>
                    </div>
                    <div className="text-front text-white dashboard-text">
                      {moonPhaseName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-right">
                <div className="dashboard-item">
                  <div className="dashboard-inner bg-dark">
                    <div className="text-back">
                      <Wow className="dashboard-box" show>
                        <Globe
                          id="EarthMain"
                          type="earth"
                          phase={earthCurrent}
                          size="168px"
                          // onClick={onClick}
                        />
                      </Wow>
                    </div>
                    <div className="text-front text-white dashboard-text">
                      {earthPhaseName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Scrollable
          className="fs-home open"
          id="MainScroll"
          style={{ backgroundColor: 'transparent' }}
          disabled
        // toTop
        >
          {/* <Wave className="fill" /> */}
          <Visualizer
            setRef={(el) => { this.visualizer = el; }}
            onStart={() => {
              this.setState({
                visual: true,
              });
            }}
            onEnd={() => {
              this.setState({
                visual: false,
              });
            }}
          />
          <div className="result-string">
            {resultString}
          </div>
          <div className="voices hidden">
            <Dropdown id="Voices" items={items} onChange={this.onVoices} value={selectedVoice} />
          </div>
          <CircularMenu
            opened={menuOpened}
            visual={visual}
            onVisualToggle={() => {
              if (this.visualizer) {
                if (this.visualizer.started) {
                  this.visualizer.stop();
                } else {
                  this.visualizer.initMic();
                }
              }
            }}
            onToggleOpened={() => {
              this.setState({
                menuOpened: !menuOpened,
              });
            }}
          />
        </Scrollable>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  loaderSet: () => { },
};

Dashboard.propTypes = {
  loaderSet: PropTypes.func,
  forecast: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  // location: PropTypes.objectOf(
  //   PropTypes.any,
  // ).isRequired,
};

const mapStateToProps = state => ({
  forecast: state.forecast,
  common: state.common,
});

const mapDispatchToProps = {
  loaderSet: setLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
