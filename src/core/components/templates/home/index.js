/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import Scrollable from '../../atoms/scrollable';

import { setLoader } from '../../../redux/actions/common';

import { Speech, SpeechRec } from '../../../helpers/helper-speech';
import { noteValues, arpeggiator } from '../../../helpers/helper-sound';

import Container from '../../atoms/container';
import Section from '../../atoms/section';
import Row from '../../atoms/row';
import Dropdown from '../../atoms/dropdown';
import Clock from '../../atoms/clock';
import Visualizer from '../../molecules/visualizer';
import Forecast from '../../organisms/forecast';
import Phase from '../../organisms/phase';

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
    this.state = {
      resultString: '',
      voices: [],
      selectedVoice: '',
    };

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.onResult = debounce(this.onResult.bind(this), 1000);
    this.onLoad = this.onLoad.bind(this);
    this.onVoices = this.onVoices.bind(this);
    // this.startSpeaking = this.startSpeaking.bind(this);
    this.endSpeaking = this.endSpeaking.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onStart = this.onStart.bind(this);

    this.started = false;
  }

  componentDidMount() {
    const { loaderSet } = this.props;
    loaderSet(true);
    setTimeout(() => {
      loaderSet(false);
    }, 500);
    this.speechRec = new SpeechRec('es-MX');
    this.speechRec.onStart = this.onStart;
    this.speechRec.onEnd = this.onEnd;
    this.speechRec.onResult = this.onResult;
    // this.speechRec.start(true, true);
    this.speech = new Speech(this.onLoad);
    // this.speech.started(this.startSpeaking);
    this.speech.ended(this.endSpeaking);
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
    } = forecast;
    const {
      resultString,
      voices,
      selectedVoice,
    } = this.state;
    const items = voices.map(v => ({ id: v.name, name: v.name, lang: v.lang }));
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
          <Visualizer />
          <div className="result-string">
            {resultString}
          </div>
          <Section className="pt-0 pb-0">
            <Container>
              <Row>
                <div id="Dashboard">
                  {
                    forecast && (
                      <div className="dashboard-box">
                        <Forecast
                          forecast={forecast}
                          hidden
                        />
                      </div>
                    )
                  }

                  {
                    earthPhases && (
                      <div className="dashboard-box">
                        <Phase
                          type="earth"
                          heading="Fase Solar"
                          subtitle={earthPhaseName}
                          desc={[
                            <Clock noseconds />,
                            `Día: ${earthPhase.elapsed}`,
                            `Restantes: ${earthPhase.remaining}`,
                          ]}
                          phases={earthPhases}
                          current={earthCurrent}
                          hidden
                        />
                      </div>
                    )
                  }

                  {
                    moonPhase && (
                      <div className="dashboard-box">
                        <Phase
                          type="moon"
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
                        />
                      </div>
                    )
                  }

                </div>

              </Row>
            </Container>
          </Section>
          <div className="voices hidden">
            <Dropdown id="Voices" items={items} onChange={this.onVoices} value={selectedVoice} />
          </div>
        </Scrollable>
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
};

const mapStateToProps = state => ({
  forecast: state.forecast,
  common: state.common,
});

const mapDispatchToProps = {
  loaderSet: setLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
