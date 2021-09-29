import libphonenumber from 'google-libphonenumber';
const PNF = libphonenumber.PhoneNumberFormat;
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export const formatPhoneWithCountryCode = (phone_number, country_code) => {
  const number = phoneUtil.parseAndKeepRawInput(phone_number, country_code);
  return phoneUtil.format(number, PNF.E164);
};
