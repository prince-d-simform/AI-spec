import * as Yup from 'yup';
import { Strings } from '../constants';

/**
 * A validation schema for the sign in form.
 * @returns {Yup.ObjectSchema}
 */
export const SigninFormSchema = Yup.object().shape({
  email: Yup.string()
    .required(Strings.YupError.requireEmailError)
    .email(Strings.YupError.invalidEmailError),
  password: Yup.string().required(Strings.YupError.requirePasswordError)
});

/**
 * A validation schema for the profile form.
 * @returns {Yup.ObjectSchema}
 */
export const ProfileFormSchema = Yup.object().shape({
  name: Yup.string()
    .transform((value) => value?.trim())
    .required(Strings.YupError.requireNameError)
    .min(2, Strings.YupError.lengthNameError)
    .max(60, Strings.YupError.lengthNameError),
  phone: Yup.string()
    .transform((value) => value?.trim())
    .required(Strings.YupError.invalidPhoneError)
    .test('phone-format', Strings.YupError.invalidPhoneError, (value) => {
      if (!value) {
        return false;
      }

      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 7 && digitsOnly.length <= 20;
    }),
  bio: Yup.string()
    .transform((value) => value?.trim())
    .max(160, Strings.YupError.lengthBioError)
    .nullable()
    .optional()
});
