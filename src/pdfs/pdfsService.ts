import { Pdf } from "./pdf";
import { S3 } from  'ibm-cos-sdk';
import { Readable } from 'stream';

export class PdfsService {
  private static cos = new S3({
    'apiKeyId': process.env.COS_API_KEY,
    'serviceInstanceId': process.env.SERVICE_INSTANCE_ID,
    'endpoint': process.env.ENDPOINT,
    'signatureVersion': 'iam'
  });
  
  public static async get(key: S3.ObjectKey): Promise<Readable> {
    try {
      let data = await this.cos.getObject({
        Bucket: 'carlos-cos-cos-standard-014',
        Key: key
      }).promise();

      return Readable.from(data.Body as Buffer);
    } catch (e) {
      throw e;
    }
  }

  public static async getAll(): Promise<Pdf[]> {
    let returnList: Pdf[] = [];

    const list = await this.cos.listObjects({
      Bucket: 'carlos-cos-cos-standard-014',
    }).promise();

    if (list && list.Contents != null) {
      returnList = list.Contents;
    }

    return returnList;
  }
}