import {S3} from "aws-sdk"
import fs  from "fs"
import { config } from "./config";
  

const s3 = new S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    endpoint: config.aws.endpoint
})



export const uploadFile = async(fileName: string, localFilePath: string)=>{
    const fileContent = fs.readFileSync(localFilePath);
    const respone = await s3.upload({
        Body: fileContent, 
        Bucket: config.aws.bucketName,
        Key: fileName
    }).promise()

}