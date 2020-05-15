import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

//MUI stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

//Redux
import { connect } from "react-redux";

const styles = (theme) => ({ ...theme.profile });

class Profile extends Component {
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    // let profileMarkup = !loading ? (
    //   authenticated ? (
    //     <Paper elevation={3}>
    //       <div className={classes.profile}>
    //         <div className=""></div>
    //       </div>
    //     </Paper>
    //   ) : (
    //     <div />
    //   )
    // ) : (
    //   <p>loading... </p>
    // );

    return <p>This is the profile</p>;
  }
}
const mapStateToProps = (state) => ({ users: state.user });

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));
