import { Pdf } from "./pdf";
import { S3 } from  'ibm-cos-sdk';
import { Error, GetObjectOutput } from "ibm-cos-sdk/clients/s3";
import { createReadStream, ReadStream } from "fs";
import { Readable } from 'stream';
import logger from "../logger";

export class PdfsService {
  private static cos = new S3({
    'apiKeyId': "EUT-Ym1mTF8xT426XTLgV5QknTh8PEKAIhElXf-IKdHI",
    'serviceInstanceId': "crn:v1:bluemix:public:cloud-object-storage:global:a/e65910fa61ce9072d64902d03f3d4774:8f8217cb-efd9-419d-85e4-dc9daffc9391::",
    'endpoint': 's3.us-east.cloud-object-storage.appdomain.cloud',
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