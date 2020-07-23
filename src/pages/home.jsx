import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream.jsx";
import Profile from "../components/Profile.jsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getScreams } from "./../redux/actions/dataActions";

//Mui
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

export class home extends Component {
  componentDidMount() {
    this.props.getScreams();
  }
  render() {
    const { screams, loading } = this.props.data;
    let recentScreamMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <Card>
        <CardContent>
          <Typography gutterBottom>Loading Screams...</Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(home);
