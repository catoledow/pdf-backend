import { S3 } from "ibm-cos-sdk";
import { Readable } from "stream";
import { Controller, Get, Path, Post, Query, Route, SuccessResponse, Response } from "tsoa";
import { PdfsService } from "./pdfsService";
  
@Route("pdfs")
export class PdfsController extends Controller {
  @Get("{pdfId}")
  @SuccessResponse('200', 'OK')
  @Response<null>('default', 'Unexpected Error')
  public async getPdf(@Path() pdfId: string): Promise<Readable | null> {
    try {
      let ret = await PdfsService.get(pdfId);
      
      this.setHeader('Content-type', 'application/pdf');
      this.setStatus(200);
      return ret;
    } catch (e) {
      if ((e as Error).toString().includes('NoSuchKey')) {
        this.setStatus(404);
      } else {
        this.setStatus(500);
      }

      return null;
    }
  }

  @Get()
  public async getAll(): Promise<{pdfs:S3.Object[]}> {
      return {
        pdfs: await PdfsService.getAll()
      }
  }
}