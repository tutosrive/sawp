import {Client} from 'pg'

ezport async function connect(){
    const conn = await new Client().connect()
    console.log(conn)
    
}