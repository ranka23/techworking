import Validator from "validator";
import isEmpty from "../utils/isEmpty.js";

const validatePost = (data) => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.text)) {
    errors.email = "Write something to post";
  }

  if (!Validator.isLength(data.text, { min: 10, max: 3000 })) {
    errors.text = "Post content needs to be at least 10 characters.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validatePost;
