import React from 'react';
import { connect } from 'react-redux';

/* IF !class */
const __ComponentName__ = () => (
  <div>
    __ComponentName__
  </div>
);

__ComponentName__.propTypes = {

};
/* ENDIF *//* IF class*/
class __ComponentName__ extends React.Component {
  static propTypes = {

  }
  render = () => (
    <div>
      __ComponentName__
    </div>
  )
}
/* ENDIF */

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(__ComponentName__);
