import { blue, pink } from "@material-ui/core/colors";

export default {
  palette: {
    primary: blue,
    secondary: pink,
  },
  login_signup: {
    typography: { userNextVariants: true },
    form: { textAlign: "center" },
    image: { minWidth: 50, maxWidth: 50, margin: "20px auto 0px  auto" },
    pageTitle: { margin: "10px auto 20px  auto" },
    button: { margin: "15px auto 0 auto", position: "relative" },
    textField: { margin: "10px auto 5px auto" },
    progress: { position: "absolute", color: "red" },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      margin: "10px auto 5px auto",
    },
  },
  delete: {
    deleteButton: { position: "absolute", left: "90%", top: "10%" },
  },
  addPost: {},

  profile: {
    root: {
      minWidth: 275,
      minHeight: 100,
      maxWidth: 345,
    },
    uploadButton: {
      position: "relative",
      top: "115px",
      left: "115px",
    },

    media: {
      margin: "20px auto 0px auto",
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
    },

    box: {
      display: "flex",
      margin: "10px auto 10px auto",
      alignItems: "center",
      justifyContent: "center",
    },
    anchor: {
      color: "#2196f3",
      margin: "0 0 0 5px",
    },
    title: {
      textAlign: "center",
      fontSize: 14,
    },
    websiteIcon: {
      position: "relative",
      top: "5px",
    },
    buttonContainer: { margin: "10px auto 10px auto" },
    button: { margin: "10px 10px 0px 10px" },
  },
  scream: {
    card: { display: "flex", marginBottom: 20, position: "relative" },
    image: { minWidth: 200 },
    content: { padding: 25, objectFit: "cover" },
  },

  EditDetails: {
    textField: { margin: "10px auto 5px auto" },
    button: { float: "right" },
  },
};
