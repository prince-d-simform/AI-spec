import _ from 'lodash';
import type { SigninFormValues } from '../SigninTypes';
import type { FormikErrors } from 'formik';

/**
 * Checks if the form has any errors or no values, then the form is not ready to submit.
 * @param {SigninFormModel} values - the values of the form.
 * @param {FormikErrors<SigninFormModel>} errors - the errors of the form.
 * @returns {boolean} - true if the form has any errors or no values.
 */
export function isRemainingToFillForm(
  values: SigninFormValues,
  errors: FormikErrors<SigninFormValues>
): boolean {
  const isError: boolean = !_.isEmpty(errors.email) || !_.isEmpty(errors.password);
  const isNoValue: boolean = _.isEmpty(values.email) || _.isEmpty(values.password);

  return isError || isNoValue;
}
