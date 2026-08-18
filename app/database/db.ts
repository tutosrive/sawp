import {Client} from 'pg'


export default class DB{
    private URL:string
    private client
    private timeout

    constructor(){
        this.URL = process.env.DB_CONNECTION_URL
        this.getClient()
    }

    private async getClient(){
        this.client = await new Client({connectionString: this.URL}).connect()
        //this.handleCloseTimeout()
    }

    private async handleCloseTimeout(isNew: boolean = false){
        if(isNew === true){
            console.info(`Is New timeout: ${isNew}`)
            console.info(`Previous timeout: ${this.timeout}`)
            this.timeout = null
        }
        this.timeout = setTimeout(async () => {
            await this.client.end()
            console.info('Client closed after 5 seconds of inactivity after start')
            this.timeout = null
        }, 5000)
    }

    private handleExecuteTimeout(callback, time: Int = 2000){
        let tmot = setTimeout(()=>{callback(); tmot = null}, time)
    }

    async addData(table: string, data){
        const query = {
            text: 'CREATE TABLE IF NOT EXISTS test1(id INTEGER PRIMARY KEY);'
        }
        console.log(`Executing query: "${query.text}"`)
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