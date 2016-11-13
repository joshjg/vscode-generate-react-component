import React from 'react';
import cssModule from 'react-css-modules';
import styles from './__ComponentName__.css';

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

export default cssModule(__ComponentName__, styles);
