import React, { Component } from 'react';

import $ from '../../../helpers/helper-jquery';

class Top extends Component {
  componentDidMount() {
    $('#MainScroll').scroll(() => {
      const scroll = $('#MainScroll').scrollTop();
      if (scroll >= 50) {
        $('#back-to-top').addClass('show');
      } else {
        $('#back-to-top').removeClass('show');
      }
    });
    $('#back-to-top').on('click', () => {
      $('#MainScroll').animate({ scrollTop: 0 }, 800, 'easeInOutQuart');
      return false;
    });
  }

  render() {
    return (
      <div id="back-to-top">
        <i className="implanf-expand_less" />
      </div>
    );
  }
}

export default Top;
