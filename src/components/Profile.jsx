import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";

//MUI stuff
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardMedia from "@material-ui/core/CardMedia";
import MuiLink from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";
import MyButton from "../util/MyButton";

const styles = (theme) => ({ ...theme.profile });

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    //send to server
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = this.refs.imageInput;
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title="Profile Picture"
          >
            <Box className={classes.uploadButton}>
              <input
                type="file"
                ref="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <MyButton
                tip="Edit Profile Picture"
                placement="top"
                onClick={this.handleEditPicture}
              >
                <EditIcon color="primary" />
              </MyButton>
            </Box>
          </CardMedia>
          <CardContent>
            <Box className={classes.box}>
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                underline="none"
                variant="h5"
              >
                {`@${handle}`}
              </MuiLink>
            </Box>

            {bio && (
              <Box className={classes.box}>
                <Typography variant="body2" component="p" color="textSecondary">
                  {bio}
                </Typography>
              </Box>
            )}

            {location && (
              <Box className={classes.box}>
                <Grid container justify="center">
                  <Grid item>
                    <LocationOn color="primary" fontSize="small" />
                  </Grid>
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                    >{`${location}`}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {website && (
              <Box className={classes.box}>
                <LinkIcon color="primary" />
                <a
                  href={website}
                  className={classes.anchor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {website}
                </a>
              </Box>
            )}
            <Box className={classes.box}>
              <Grid container justify="center" spacing={1}>
                <Grid item>
                  <CalendarToday color="primary" fontSize="small" />
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" variant="subtitle2">
                    Joined {dayjs(createdAt).format("MMM YYYY")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <MyButton tip="logout" placement="top" onClick={this.handleLogout}>
              <KeyboardReturn color="primary" />
            </MyButton>
            <EditDetails />
          </CardContent>
        </Card>
      ) : (
          // not authenticated
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                No profile found. Please login again
            </Typography>
            </CardContent>
            <CardActions>
              <div className={classes.buttonContainer}>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  component={Link}
                  to="/login"
                  className={classes.button}
                >
                  Login
              </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  component={Link}
                  to="/signup"
                  className={classes.button}
                >
                  signup
              </Button>
              </div>
            </CardActions>
          </Card>
        )
    ) : (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} gutterBottom>
              Profile Loading...
          </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      );
    return profileMarkup;
  }
}
const mapStateToProps = (state) => ({ user: state.user });

const mapActiontoProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapActiontoProps
)(withStyles(styles)(Profile));
