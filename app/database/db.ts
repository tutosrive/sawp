import {Client} from 'pg'
import {readFile} from 'node:fs/promises'
    
export default class DB{
    private URL:string
    private client
    private timeout

    constructor(){
        this.URL = process.env.DB_CONNECTION_URL
        //this.getClient()
        this.createTables()
    }

    private async createTables(){
        const tables = await readFile('app/database/tables.sql', 'utf-8')
        console.log(tables)
        const req = async () => {
            await this.client.query("")
        }
        //this.handleExecuteTimeout(req, 5000)
    }

    private async getClient(){
        this.client = await new Client({connectionString: this.URL}).connect()
        this.handleCloseTimeout()
    }

    private async handleCloseTimeout(isNew: boolean = false){
        if(isNew === true){
            this.timeout = null
        }
        this.timeout = setTimeout(async () => {
            await this.client.end()
            console.info('Client closed after 5 seconds of inactivity.')
            this.timeout = null
        }, 5000)
    }

    private handleExecuteTimeout(callback, time: Int = 2000){
        let tmot = setTimeout(()=>{callback(); tmot = null}, time)
    }

    async addData(query){
        const req = async () => {
            await this.client.query(query)
            this.handleCloseTimeout(true)
        }
        this.runCallback(req, 5000)
    }

    private runCallback(req, time){
        if(this.client === undefined || thid.client === null){
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