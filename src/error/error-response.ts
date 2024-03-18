export class ResponseError extends Error {
  constructor(public field: number, public message: string) {
    super(message);
  }
}
