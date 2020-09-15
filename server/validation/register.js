import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validateRegister = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid Email address";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be more than 6 characters";
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password required";
  }

  if (!Validator.equals(data.confirmPassword, data.password)) {
    errors.confirmPassword = "Passwords don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegister;
