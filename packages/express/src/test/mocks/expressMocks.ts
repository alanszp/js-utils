import { GenericRequest } from "../../types/GenericRequest";

export const mockRequest = (authorization: string): GenericRequest => {
  return {
    headers: { authorization },
    context: { jwtUser: undefined, authenticated: [] },
  } as any as GenericRequest;
};

export const mockResponse = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();
