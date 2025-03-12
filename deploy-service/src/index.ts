import { createClient , commandOptions} from "redis";
import { downlaodS3Folder } from "./aws";
import { buildProject, copyFinalDist } from "./utils";
const subscriber = createClient()
subscriber.connect()

const publisher = createClient();
publisher.connect()
async function main() {
    while(1){
        const response = await subscriber.brPop(
            commandOptions({isolated:true}),
            "build-queue", 
            0

        )
        //@ts-ignore
        const id  = response.element
        await downlaodS3Folder(`output/${id}`)
        await buildProject(id)
        await copyFinalDist(id)
        publisher.hSet("status", id, "deployed")
    }
}
main()