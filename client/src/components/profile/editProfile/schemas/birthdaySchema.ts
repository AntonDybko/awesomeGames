import * as yup from "yup";

const birthdaySchema = yup.object().shape({
  birthday: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), "Enter real birthday date please")
});

export default birthdaySchema;
