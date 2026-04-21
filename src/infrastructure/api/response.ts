import { NextResponse } from "next/server";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function ok<T>(data: T, init?: ResponseInit): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data
    },
    init
  );
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {})
      }
    },
    { status }
  );
}
