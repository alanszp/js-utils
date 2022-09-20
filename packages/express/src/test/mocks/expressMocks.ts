import { GenericRequest } from "../../types/GenericRequest";

export const mockRequest = (
  authorization: string,
  otherHeaders?: Record<string, unknown>
): GenericRequest => {
  const headers = { authorization, ...otherHeaders };
  return {
    headers,
    context: { jwtUser: undefined, authenticated: [] },
    header: (name: string) => headers[name],
  } as any as GenericRequest;
};

export const mockRequestWithBody = (
  authorization: string,
  otherHeaders?: Record<string, unknown>,
  body: Record<string, unknown> = {}
): GenericRequest => {
  return {
    ...mockRequest(authorization, otherHeaders),
    body,
  } as any as GenericRequest;
};

export const mockResponse = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();
