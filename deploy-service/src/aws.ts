import {S3} from "aws-sdk"
import fs  from "fs"
import { config } from "./config";
import path, { dirname } from 'path'
const s3 = new S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    endpoint: config.aws.endpoint
})



export async  function downlaodS3Folder(prefix: string){
    const allFiles = await s3.listObjectsV2({
        Bucket: config.aws.bucketName,
        Prefix: prefix
    }).promise()

    const allPromises = allFiles.Contents?.map(async ({Key})=>{
        return new Promise(async (resolve)=>{
            if(!Key){
                resolve("")
                return;
            }
            const finalOutputPath = path.join(__dirname, Key)
            const outputFile = fs.createWriteStream(finalOutputPath)
            const dirName = path.dirname(finalOutputPath)
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, {recursive: true})
            }
            s3.getObject({
                Bucket: config.aws.bucketName,
                Key
            }).createReadStream().pipe(outputFile)
            .on("finish", ()=>{
                resolve("")
            })
        })
    }) || []
    await Promise.all(allPromises?.filter(x=>x !== undefined))
}

export const uploadFile = async(fileName: string, localFilePath: string)=>{
    const fileContent = fs.readFileSync(localFilePath);
    const respone = await s3.upload({
        Body: fileContent, 
        Bucket: config.aws.bucketName,
        Key: fileName
    }).promise()

}