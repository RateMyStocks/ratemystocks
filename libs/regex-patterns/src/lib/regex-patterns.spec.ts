import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from './regex-patterns';

describe('regexPatterns', () => {
  it('should properly validate usernames using the regex pattern', () => {
    expect(USERNAME_REGEX.test('a')).toEqual(true);
    expect(USERNAME_REGEX.test('testuser')).toEqual(true);
    expect(USERNAME_REGEX.test('testuser123')).toEqual(true);
    expect(USERNAME_REGEX.test('test_user123')).toEqual(true);
    expect(USERNAME_REGEX.test('test.user123')).toEqual(true);
    expect(USERNAME_REGEX.test('testuser123__')).toEqual(true);
    expect(USERNAME_REGEX.test('testuser123.__')).toEqual(true);
    expect(USERNAME_REGEX.test('abcdefghijklmnopqrstuvwxyz1234')).toEqual(true);

    expect(USERNAME_REGEX.test('abcdefghijklmnopqrstuvwxyz12345')).toEqual(false); // greater than 30 characters
    expect(USERNAME_REGEX.test('testuser123!')).toEqual(false); // invalid symbol (exclamation point)
    expect(USERNAME_REGEX.test('testuser123#')).toEqual(false); // invalid symbol (pound sign)
    expect(USERNAME_REGEX.test('testuser123?')).toEqual(false); // invalid symbol (question mark)
    expect(USERNAME_REGEX.test('test user')).toEqual(false); // invalid symbol (space)
    expect(USERNAME_REGEX.test('')).toEqual(false);
  });

  /** {@link Examples: https://gist.github.com/cjaoude/fd9910626629b53c4d25 } */
  it('should properly validate emails using regex pattern', () => {
    expect(EMAIL_REGEX.test('test@example.com')).toEqual(true);
    expect(EMAIL_REGEX.test('test.user@gmail.com')).toEqual(true);
    expect(EMAIL_REGEX.test('test123@gmail.com')).toEqual(true);
    expect(EMAIL_REGEX.test('id-with-dash@domain.com')).toEqual(true);
    expect(EMAIL_REGEX.test('a@domain.com')).toEqual(true); // one-letter local part
    expect(EMAIL_REGEX.test('example-abc@abc-domain.com')).toEqual(true);
    expect(EMAIL_REGEX.test('email@example.co.jp')).toEqual(true);
    expect(EMAIL_REGEX.test('email@example.museum')).toEqual(true);
    expect(EMAIL_REGEX.test('email@[123.123.123.123]')).toEqual(true);
    // expect(EMAIL_REGEX.test('email@123.123.123.123')).toEqual(true);
    expect(EMAIL_REGEX.test('firstname+lastname@example.com')).toEqual(true);
    expect(EMAIL_REGEX.test('email@subdomain.example.com')).toEqual(true);
    // expect(EMAIL_REGEX.test('admin@mailserver1')).toEqual(true); // local domain name with no top-level domain

    expect(EMAIL_REGEX.test('test @gmail.com')).toEqual(false); // invalid space
    expect(EMAIL_REGEX.test('test')).toEqual(false);
    expect(EMAIL_REGEX.test('example.com')).toEqual(false); // no @
    expect(EMAIL_REGEX.test('A@b@c@domain.com')).toEqual(false); // only one @ is allowed outside quotation marks
    expect(EMAIL_REGEX.test('#@%^%#$@#$@#.com')).toEqual(false);
    expect(EMAIL_REGEX.test('Joe Smith <email@example.com>')).toEqual(false);
    expect(EMAIL_REGEX.test('email@example@example.com')).toEqual(false);
  });

  it('should properly validate passwords using regex pattern', () => {
    expect(PASSWORD_REGEX.test('UrD##43N')).toEqual(true);
    expect(PASSWORD_REGEX.test('*sn3$Uo8DYU9Lo8A$yB7bCFXxmnx&ZM@4^1PxTFG15hxW$s#%J')).toEqual(true);
    expect(PASSWORD_REGEX.test('Democr@ backstab c0ncise moisture')).toEqual(true);
    expect(PASSWORD_REGEX.test('Somepassw0rd!')).toEqual(true);

    expect(PASSWORD_REGEX.test('Somepassw0rd')).toEqual(false);
    expect(PASSWORD_REGEX.test('$pUPfm')).toEqual(false);
    expect(PASSWORD_REGEX.test('test')).toEqual(false);
    expect(PASSWORD_REGEX.test('testpassword')).toEqual(false);
  });
});
