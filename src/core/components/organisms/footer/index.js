import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ id }) => (
  <footer id={id} className="footer footer-type-4">
    <div className="bottom-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-xs-12 copyright">
            <span>
              2019 TonyAI
            </span>
          </div>
          <div className="col-md-6 col-xs-12 footer-socials mt-mdm-10 text-right">
            <ul className="bottom-footer-links style-2">
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

Footer.defaultProps = {
  id: '',
};

Footer.propTypes = {
  id: PropTypes.string,
};

export default Footer;
