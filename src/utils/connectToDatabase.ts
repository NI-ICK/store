import mysql from 'mysql2/promise'

export async function connectToDatabase() {
    try {
        return await mysql.createConnection(`${process.env.DB_URI}`)
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log("Error connecting to database: ", message)
    }
}