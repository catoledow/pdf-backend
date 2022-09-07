import { Controller, Get, Route, SuccessResponse } from "tsoa";
  
@Route("probes")
export class ProbesController extends Controller {
  @Get("liveness")
  @SuccessResponse('200', 'OK')
  public async live(): Promise<void> {
    try {
      // something
      this.setStatus(200);
    } catch (e) {
      this.setStatus(500);
    }
  }

  @Get("readiness")
  public async ready(): Promise<void> {
    try {
      // something
      this.setStatus(200);
    } catch (e) {
      this.setStatus(500);
    }
  }
}