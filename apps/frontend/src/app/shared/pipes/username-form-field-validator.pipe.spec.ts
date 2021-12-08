import { UsernameFormFieldValidatorPipe } from './username-form-field-validator.pipe';

describe('UsernameFormFieldValidatorPipe', () => {
  it('create an instance', () => {
    const pipe = new UsernameFormFieldValidatorPipe();
    expect(pipe).toBeTruthy();
  });
});
