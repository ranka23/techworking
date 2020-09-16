import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validateLogin = (data) => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid Email address";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password required";
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateLogin;
