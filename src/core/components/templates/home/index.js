/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import * as qs from 'query-string';

import Scrollable from '../../atoms/scrollable';

import { setLoader } from '../../../redux/actions/common';

import { Speech, SpeechRec } from '../../../helpers/helper-speech';
import { noteValues, arpeggiator } from '../../../helpers/helper-sound';

import Section from '../../atoms/section';
import Row from '../../atoms/row';
import Dropdown from '../../atoms/dropdown';
import Clock from '../../atoms/clock';
import Visualizer from '../../molecules/visualizer';
import Forecast from '../../organisms/forecast';
import Phase from '../../organisms/phase';
import CircularMenu from '../../molecules/circular-menu';
import Modal from '../../molecules/modal';
import Wow from '../../atoms/wow';

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

class Home extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search, { ignoreQueryPrefix: true });

    this.state = {
      resultString: '',
      voices: [],
      selectedVoice: '',
      menuOpened: false,
      visual: false,
      modal: query.display || '',
      smallMoon: false,
      smallEarth: false,
    };

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.onResult = debounce(this.onResult.bind(this), 1000);
    this.onLoad = this.onLoad.bind(this);
    this.onVoices = this.onVoices.bind(this);
    // this.startSpeaking = this.startSpeaking.bind(this);
    this.endSpeaking = this.endSpeaking.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onHashChanged = this.onHashChanged.bind(this);

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

  onHashChanged(e) {
    const { location } = this.props;
    const { search } = location;
    console.log(e);
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    console.log(query);
    this.setState({
      modal: query.display || '',
    });
  }

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
      moonPhase,
      earthPhase,
      earthPhases,
      moonPhases,
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
      modal,
      smallMoon,
      smallEarth,
    } = this.state;
    const items = voices.map(v => ({ id: v.name, name: v.name, lang: v.lang }));
    // console.log(forecast);
    return (
      <div
        id="Home"
        className="app__page"
        ref={(el) => { this.container = el; }}
        disabled
      >
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
          <Section className="pt-0 pb-0">
            <div className="container-fluid">
              <Row>
                <div id="Dashboard">
                  {
                    earthPhases && (
                      <div>
                        <div className={`dashboard-box ${smallEarth ? 'small' : ''}`}>
                          <Phase
                            type="earth"
                            size="80px"
                            heading={<Clock noseconds format="dddd hh:mm A" />}
                            subtitle={earthPhaseName}
                            desc={[
                              <Clock noseconds format="MMMM DD [del] YYYY" />,
                              `Día: ${earthPhase.elapsed}`,
                              `Restantes: ${earthPhase.remaining}`,
                            ]}
                            phases={earthPhases}
                            current={earthCurrent}
                            hidden
                            onClick={() => {
                              this.setState({
                                smallEarth: !smallEarth,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )
                  }

                  {
                    moonPhase && (
                      <div>
                        <div className={`dashboard-box ${smallMoon ? 'small' : ''}`}>
                          <Phase
                            type="moon"
                            size="80px"
                            heading="Fase Lunar"
                            subtitle={moonPhaseName}
                            desc={[
                              `Fase: ${moonPhase.phase.toFixed(2)}`,
                              `Luz: ${moonPhase.illuminated.toFixed(2)}%`,
                              `Edad: ${moonPhase.age.toFixed(2)}`,
                            ]}
                            phases={moonPhases}
                            current={moonCurrent}
                            hidden
                            onClick={() => {
                              this.setState({
                                smallMoon: !smallMoon,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )
                  }

                </div>

              </Row>
            </div>
          </Section>
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
        {
          forecast && (
            <Modal
              opened={modal === 'clima'}
              className="modal-info"
              title="Clima en Tijuana"
              onCancel={() => {
                this.setState({
                  modal: '',
                });
              }}
            >
              <Wow className="dashboard-box" show={modal === 'clima'}>
                <Forecast
                  weatherMetric={weatherMetric}
                  forecastList={forecastList}
                />
              </Wow>
            </Modal>
          )
        }
        {
          earthPhases && (
            <Modal
              opened={modal === 'hora'}
              className="modal-info"
              title={earthPhaseName}
              onCancel={() => {
                this.setState({
                  modal: '',
                });
              }}
            >
              <Wow className="dashboard-box" show={modal === 'hora'}>
                <Phase
                  type="earth"
                  size="200px"
                  heading={<Clock noseconds format="dddd" />}
                  subtitle={<Clock noseconds format="hh:mm A" />}
                  desc={[
                    <Clock noseconds format="MMMM DD [del] YYYY" />,
                    `Día: ${earthPhase.elapsed}`,
                    `Restantes: ${earthPhase.remaining}`,
                  ]}
                  phases={earthPhases}
                  current={earthCurrent}
                />
              </Wow>
            </Modal>
          )
        }
        {
          moonPhase && (
            <Modal
              opened={modal === 'fase'}
              className="modal-info"
              title="Fase Lunar"
              onCancel={() => {
                this.setState({
                  modal: '',
                });
              }}
            >
              <Wow className="dashboard-box" show={modal === 'fase'}>
                <Phase
                  type="moon"
                  size="200px"
                  heading="Fase Lunar"
                  subtitle={moonPhaseName}
                  desc={[
                    `Fase: ${moonPhase.phase.toFixed(2)}`,
                    `Luz: ${moonPhase.illuminated.toFixed(2)}%`,
                    `Edad: ${moonPhase.age.toFixed(2)}`,
                  ]}
                  phases={moonPhases}
                  current={moonCurrent}
                />
              </Wow>
            </Modal>
          )
        }
      </div>
    );
  }
}

Home.defaultProps = {
  loaderSet: () => { },
};

Home.propTypes = {
  loaderSet: PropTypes.func,
  forecast: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
  location: PropTypes.objectOf(
    PropTypes.any,
  ).isRequired,
};

const mapStateToProps = state => ({
  forecast: state.forecast,
  common: state.common,
});

const mapDispatchToProps = {
  loaderSet: setLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
