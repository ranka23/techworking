import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validateExperience = (data) => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateExperience;
