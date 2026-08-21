import {Client} from 'pg'
import {readFile} from 'node:fs/promises'
    
export default class DB{
    private URL:string
    private client
    private timeout

    constructor(){
        this.URL = process.env.DB_CONNECTION_URL
        this.getClient()
    }

    async createTables(callback? = null){
        const tables = await readFile('app/database/tables.sql', 'utf8')
        const req = async () => {
            //await this.client.query(tables, (err, res) => {callback(err, res)})
            this.runQuery('Creating Database Tables', tables, callback)
        }
        this.handleExecuteTimeout(req, 5000)
    }

    private async getClient(){
        console.log('Getting Postgres Client')
        this.client = await new Client({connectionString: this.URL}).connect()
    }

    private handleExecuteTimeout(callback, time: Int = 2000){
        let tmot = setTimeout(()=>{callback(); tmot = null}, time)
    }

    async runQuery(queryName, query, callback? = null){
        const req = async () => {
            const q = {text: query}
            console.log(`Executing query: ${queryName}`)
            await this.client.query(q, (err, res) => {
                if(callback !== null) callback(err, res)
                else console.log(`Query Executed: ${queryName}`)
            })
        }
        this.runCallback(req, 5000)
    }

    private runCallback(req, time){
        if(this.client === undefined || this.client === null){
            this.handleExecuteTimeout(req, time)
        } else {
            req()
        }
    }

    async closeClient(){
        if(this.client !== null || thid.client !== undefined){
            await this.client.end()
        }
    }
}