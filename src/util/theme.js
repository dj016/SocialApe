export default {
  palette: {
    primary: {
      light: "#fff350",
      dark: "#c79100",
      main: "#ffc107",
      contrastText: "#000000",
    },
    secondary: {
      light: "#6a4f4b",
      dark: "#1b0000",
      main: "#3e2723",
      contrastText: "#ffffff",
    },
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
  profile: {},
  scream: {
    card: { display: "flex", marginBottom: 20 },
    image: { minWidth: 100 },
    content: { padding: 25, objectFit: "cover" },
  },
};
