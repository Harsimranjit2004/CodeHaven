import path from "path"
import fs from "fs"

export const getAllFilePaths = (folderPath: string)=>{
    let response: string[] = [];

    const allFilesandFolder = fs.readdirSync(folderPath)
    allFilesandFolder.forEach(file=>{
        const fullFilePath = path.join(folderPath, file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFilePaths(fullFilePath))
        }else{
            response.push(fullFilePath)
        }
    })
    return response
}

  
  // -> access id 267fe30fd3f236a3f970c0b9c7aacccf
  // -> secre access key 39ff7d3b884c11020f89bdcecf1a715309e45ba677abb759231ccc80fa3bcc70
  // -> Url https://828e2a762c265d7cbca15d4d50e19460.r2.cloudflarestorage.com
  // account ID 828e2a762c265d7cbca15d4d50e19460
  // -> token value gAh_XLkxckbGt09eZSVesvPFf9nd3lZTXI5zMRHF