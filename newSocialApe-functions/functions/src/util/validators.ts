const isEmpty = (string: String) => {
  if (string.trim() === "") return true;
  else return false;
};

const isValidEmail = (email: String) => {
  const emailRegEx: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

const validateSignUpData = (data: any) => {
  const errors: any = {};
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty!";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Must be a valid email";
  }
  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Does not match the password";
  }
  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

const validateLoginData = (data: any) => {
  const errors: Object = {};
  if (isEmpty(data.email)) {
    Object.assign(errors, { email: "Must not be empty" }, errors);
  } else if (!isValidEmail(data.email)) {
    Object.assign(errors, { email: "Must be valid" }, errors);
  }
  if (isEmpty(data.password))
    Object.assign(errors, { password: "Must not be empty" }, errors);

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
const reduceUserDetails = (data: any) => {
  const userDetails = {};
  //if (!isEmpty(data.bio.trim()))
  Object.assign(userDetails, { bio: data.bio.trim() }, userDetails);
  //if (!isEmpty(data.website.trim())) {
  if (data.website.trim() === "") {
    Object.assign(userDetails, { website: "" }, userDetails);
  } else if (data.website.trim().substring(0, 4) !== "http")
    Object.assign(
      userDetails,
      { website: `http://${data.website.trim()}` },
      userDetails
    );
  else
    Object.assign(userDetails, { website: data.website.trim() }, userDetails);
  //}
  //if (!isEmpty(data.location.trim()))
  Object.assign(userDetails, { location: data.location.trim() }, userDetails);
  return userDetails;
};

export { validateLoginData, validateSignUpData, reduceUserDetails };
