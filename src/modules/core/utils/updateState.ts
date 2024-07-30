export const updateState = (previousState: {}, inputPayload: {}) => {
  const keys = Object.keys(inputPayload);
  const updatedState: any = previousState || {};
  keys.forEach((key) => {
    updatedState[key] = (inputPayload as any)[key];
  });
  return updatedState;
};
