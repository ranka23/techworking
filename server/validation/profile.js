import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validateProfile = (data) => {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Add at least one skill";
  }

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be 2 to 4 characters";
  }


  !isEmpty(data.website) && !Validator.isURL(data.website)
    ? (errors.website = "Invalid URL")
    : null;

  !isEmpty(data.youtube) && !Validator.isURL(data.youtube)
    ? (errors.youtube = "Invalid URL")
    : null;

  !isEmpty(data.twitter) && !Validator.isURL(data.twitter)
    ? (errors.twitter = "Invalid URL")
    : null;

  !isEmpty(data.facebook) && !Validator.isURL(data.facebook)
    ? (errors.facebook = "Invalid URL")
    : null;

  !isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)
    ? (errors.linkedin = "Invalid URL")
    : null;

  !isEmpty(data.instagram) && !Validator.isURL(data.instagram)
    ? (errors.instagram = "Invalid URL")
    : null;

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateProfile;
