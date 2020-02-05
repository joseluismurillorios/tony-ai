/* eslint-disable */

import React, { Component } from 'react';

import Loader from '../atoms/loader';

const isEmpty = prop => (
  prop === null ||
  prop === undefined ||
  (prop.hasOwnProperty('length') && prop.length === 0) ||
  (prop.constructor === Object && Object.keys(prop).length === 0)
);

const LoaderHOC = propName => (WrappedComponent) => {
  return class LoaderHOC extends Component {
    render() {
      // console.log(isEmpty(this.props[propName]), this.props[propName]);
      return isEmpty(this.props[propName]) ?
        <Loader className={this.props.className} />
        :
        <WrappedComponent {...this.props} />;
    }
  };
};

export default LoaderHOC;
