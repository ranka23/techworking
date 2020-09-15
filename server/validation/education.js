import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validateEducation = (data) => {
  let errors = {};

  data.institution = !isEmpty(data.institution) ? data.institution : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.institution)) {
    errors.institution = "Institution name required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree required";
  }

  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = "Field of Study required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateEducation;
