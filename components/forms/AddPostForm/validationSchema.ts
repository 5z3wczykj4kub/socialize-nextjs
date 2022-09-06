import { object, string } from 'yup';

const contentValidation = string().trim().required('Content is required');

const validationSchema = object().shape({
  content: contentValidation,
});

export default validationSchema;
