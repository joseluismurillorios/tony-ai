import React from 'react';
import PropTypes from 'prop-types';

import Linked from '../linked';

import { isMobile } from '../../../helpers/helper-util';

import Aether from '../aether';

const PageTitle = ({
  text,
  paths,
  aether,
  height,
}) => (
  <section
    className={`page-title ${isMobile ? 'title-sm' : ''} text-center`}
  >
    {
      aether && (
        <Aether className="fill" />
      )
    }
    <div className="container relative clearfix" style={aether ? { height } : {}}>
      <div className="title-holder">
        <div className="title-text">
          <h1 className="uppercase">{text}</h1>
          <ol className="breadcrumb">
            <li className="active">
              <Linked url="/">
                Inicio
              </Linked>
            </li>
            {
              paths
              && paths.map(path => (
                <li key={`/${path}`}>
                  <Linked url={`/${path}`}>
                    {path.split('-').join(' ')}
                  </Linked>
                </li>
              ))
            }
            <li className="active">
              <span>{text}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
);

PageTitle.defaultProps = {
  aether: false,
  height: '80px',
};

PageTitle.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.any).isRequired,
  text: PropTypes.element.isRequired,
  aether: PropTypes.bool,
  height: PropTypes.string,
};

export default PageTitle;
