import DB from '../database/db.ts'
import createInsertQuery from './query.ts'

export default async function runs(data){
    const db = new DB()
    console.log(`Running supabase with data from user "${data.user.login}" ...`)
    const queryInserts = createInsertQuery(data)
    let timeout = setTimeout(async()=>{
        await db.addData(queryInserts)
        timeout = null
        //await db.closeClient()
    }, 30000)
}