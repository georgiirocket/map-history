import { LOGS } from "../schema/schema"

interface logsParams {
    message?: string,
    error: string
}

export const logs = async ({ message = "", error }: logsParams) => {
    try {
        let newLogs = new LOGS({
            message: message,
            error: error
        })
        await newLogs.save()
        console.log("Message:", message)
        console.log("Error:", error)
    } catch (err: any) {
        console.log(err ? err.toString() : "")
    }
}