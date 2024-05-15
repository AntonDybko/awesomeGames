import * as yup from "yup";
import axios from "axios-config/axios";

const imageSchema = yup.object().shape({
  picture_url: yup
    .string()
    .required('required')
    .test('fileSize', "Maximum file size is 2Mb", (value) => {
      if (!value) {
        console.log(!value)
        return true;
      }
      console.log(value.length , value.length < 2097152)
      return value.length < 2097152;
    }),
});

export default imageSchema;
