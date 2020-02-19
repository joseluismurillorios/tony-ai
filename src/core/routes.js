import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { ROUTES } from './components/templates';
import Home from './components/templates/home';
import NotFound from './components/templates/notfound';

const SUB = [];

ROUTES.map(o => o.items.map(s => SUB.push(s)));

const Routes = ({ history }) => {
  const { location } = history;
  const timeout = { enter: 1000, exit: 1000 };
  return (
    <TransitionGroup id="Transition" className="app__group fill">
      <CSSTransition key={location.pathname} timeout={timeout} classNames="fade" appear>
        <Switch location={location}>
          <Route path="/" exact component={Home} />
          {
            ROUTES.map(obj => (
              <Route key={obj.url} path={obj.url} exact component={obj.component} />
            ))
          }
          {
            SUB.map(obj => (
              <Route key={obj.url} path={obj.url} exact component={obj.component} />
            ))
          }
          <Route path="*" exact component={NotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

Routes.propTypes = {
  history: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
};


const mapStateToProps = state => ({
  location: state.location,
  common: state.common,
});

const mapDispatchToProps = {
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
