import React, { Component } from 'react';
import PropTypes from 'prop-types';

import $ from '../../../helpers/helper-jquery';
// import assets from '../../../assets';

import Rotator from '../../atoms/rotator';
// import Aether from '../../atoms/aether';
import Linked from '../../atoms/linked';
import Wave from '../../atoms/waves';

const content = [
  {
    text: 'Clima',
    className: 'rotate',
    animation: 'fade',
  },
  {
    text: 'Reportes',
    className: 'rotate',
    animation: 'fade',
  },
  {
    text: 'Mapas',
    className: 'rotate',
    animation: 'fade',
  },
];

class Hero extends Component {
  constructor(props) {
    super(props);
    this.scrollTo = this.scrollTo.bind(this);
    this.resizeChange = this.resizeChange.bind(this);
  }

  componentDidMount() {
    const { onLoad } = this.props;
    $(this.container).height(window.innerHeight - $('#Header').height());
    $('.nav-wrap').on('hidden.bs.collapse', () => {
      // console.log(data);
      $(this.container).height(window.innerHeight - $('#Header').height());
      onLoad(false);
    });

    window.addEventListener('resize', this.resizeChange);

    setTimeout(() => {
      onLoad(false);
    }, 500);
  }

  resizeChange() {
    setTimeout(() => {
      $(this.container).height(window.innerHeight - $('#Header').height());
    }, 200);
  }

  scrollTo() {
    const { goTo } = this.props;
    // const myElement = document.getElementById(goTo);
    // const topPos = myElement.offsetTop;
    // document.getElementById('overlay').scrollTop = topPos;

    console.log(goTo);

    $('#MainScroll').animate({
      scrollTop: $('#MainScroll').scrollTop() + ($(`#${goTo}`).offset().top - $('#MainScroll').offset().top),
    }, 800, 'easeInOutQuart');


    // $('#MainScroll').scrollTo(0, $(`#${goTo}`).offset().top);
  }

  render() {
    return (
      <section className="hero-wrap text-center bg-primary">
        <div ref={(el) => { this.container = el; }} className="container">
          <Wave className="fill" />
          <div className="hero-holder">
            <div className="hero-message text-rotator">
              <h1>
                <Rotator
                  content={content}
                  time={4000}
                  startDelay={200}
                />
              </h1>
              <h2 className="hero-subtitle">RYR Web facilita la comprensión del panorama de riesgo en la región.</h2>
              <div className="buttons-holder mt-30">
                <Linked url="/reportes" className="btn btn-md rounded btn-white">
                  Ver Reportes de Riesgo
                </Linked>
              </div>
              <div className="local-scroll">
                <button onClick={this.scrollTo} type="button" className="scroll-down btn-color">
                  <i className="implanf-expand_more" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Hero.defaultProps = {
  goTo: '',
  onLoad: () => {},
};

Hero.propTypes = {
  goTo: PropTypes.string,
  onLoad: PropTypes.func,
};

export default Hero;
