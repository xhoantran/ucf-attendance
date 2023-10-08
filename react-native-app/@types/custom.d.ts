export type Payload<_string extends string | number | symbol, value> = {
  payload: {
    [key in _string]: value;
  };
};
