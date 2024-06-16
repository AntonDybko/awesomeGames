import * as yup from "yup";

const imageSchema = yup.object().shape({
  picture_url: yup
    .string()
    .required('required')
    .test('fileSize', "Maximum file size is 2Mb", (value) => {
      if (!value) {
        return true;
      }
      return value.length < 2097152;
    }),
});

export default imageSchema;
