import {exec, spawn} from "child_process"
import fs from 'fs'
import path from "path"
import { uploadFile } from "./aws"

export function buildProject(id: string){
    return new Promise((resolve)=>{
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)
        child.stdout?.on('data', function(data){
            console.log('stdout: '+ data)
        })
        child.stderr?.on('data', function(data){
            console.log('stderr: '+ data)
        })
        child.on('close', function(code){
            resolve("")
        })
    })
}

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


export function copyFinalDist(id:string){
    const folderPath = path.join(__dirname, `output/${id}/build`)
    const allFiles = getAllFilePaths(folderPath)
    allFiles.forEach(file=>{
        uploadFile(`dist/${id}/` + file.slice(folderPath.length+1), file)
    })
}