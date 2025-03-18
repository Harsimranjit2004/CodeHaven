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

 