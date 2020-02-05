/* eslint-disable react/no-children-prop */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';

const NavItem = ({
  children,
  to,
  exact,
  onClick,
  className,
}) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => (
      <Link
        className={match ? `${className} active` : className}
        to={to}
        replace={match && to === match.path}
        onClick={onClick}
      >
        {children}
      </Link>
    )}
  />
);

NavItem.defaultProps = {
  onClick: () => {},
  className: '',
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default NavItem;
