export const determineInputType = (value) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const phonePattern = /^[0-9]+$/; // Simplistic phone regex, you might want to use a more comprehensive one

  if (emailPattern.test(value)) {
    return "email";
  } else if (phonePattern.test(value)) {
    return "phoneNumber";
  } else {
    return "username";
  }
};
