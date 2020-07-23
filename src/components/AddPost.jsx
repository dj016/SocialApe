import React, { Component, Fragment } from "react";
import MyButton from "../util/MyButton";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
//mui stuff
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//icons
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

//redux
import { connect } from "react-redux";
import { postScream } from "../redux/actions/dataActions";

const styles = (theme) => ({ ...theme.addPost });

class AddPost extends Component {
  state = { open: false, scream: "", errors: {} };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handlePost = () => {
    this.props.postScream({ body: this.state.scream });
    //this.handleClose();
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.errors).length === 0)
      this.setState({ open: false });
    this.setState({ scream: "" });
  }
  render() {
    const { classes } = this.props;
    const { errors } = this.props;
    return (
      <Fragment>
        <MyButton tip="Post a scream!" onClick={this.handleOpen}>
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle> Create a post </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="scream"
                label="Scream"
                type="text"
                multiline
                autoFocus
                rows="3"
                helperText={errors.body}
                error={errors.body ? true : false}
                placeholder="Write your scream here"
                className={classes.textField}
                value={this.state.scream}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              {" "}
              Cancel
            </Button>
            <Button onClick={this.handlePost} color="primary">
              {" "}
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

AddPost.propTypes = {
  classes: PropTypes.object.isRequired,
  postScream: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  errors: state.data.errors,
  posted: state.data.posted,
});
export default connect(mapStateToProps, { postScream })(
  withStyles(styles)(AddPost)
);
