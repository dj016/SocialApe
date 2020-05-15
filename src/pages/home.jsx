import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Scream from "../components/Scream.jsx";

export class home extends Component {
  state = { screams: null };
  async componentDidMount() {
    try {
      const res = await axios.get("/screams");
      console.log(res.data);
      this.setState({ screams: res.data });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    let recentScreamMarkup = this.state.screams ? (
      this.state.screams.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile ......</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
