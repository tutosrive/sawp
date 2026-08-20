import DB from '../database/db.ts'
import createInsertQuery from './query.ts'

export default async function runs(data){
    console.log(`Running supabase with data from user "${data.user.login}" ...`)
    const db = new DB()
    console.log('Creating database tables')
    await db.createTables((e, r) => {dispatchQueries(db, e, r)})
    const queryInserts = createInsertQuery(data)
    //let timeout = setTimeout(async()=>{
        //await db.runQuery(queryInserts)
        //timeout = null
        //await db.closeClient()
    //}, 10000)
}

async function dispatchQueries(db, err, res){
    if((err !== undefined) && (err !== null)){
        console.log('Not error')
        return
    }
    console.log('error')
    console.log(err, res)
    db.closeClient()
}