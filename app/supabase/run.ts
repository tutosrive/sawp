import DB from '../database/db.ts'
import createInsertQuery from './query.ts'
import Helpers from '../utils/helpers.ts'

export default async function runs(data:any){
    console.log(`Running supabase with data from user "${data.user.login}" ...`)
    await createInsertQuery(data, true)
    
    //const db = new DB()
    //await db.createTables(async(e:any, r:any) => {await dispatchQueries(data, db, e, r)})
}

async function dispatchQueries(data:any, db:any, err:any, res:any){
    Helpers.catchResultQuery('Create Databse Tables',
        err, res, async()=>{await callOk(data, db)}
    )
}

async function callOk(data:any, db:DB){
    const queryInserts: string = await createInsertQuery(data, true)
    const queryName = 'Insert Data Into Database Tables'
    await db.runQuery(queryName, queryInserts, async (e:any, r:any) => {
        Helpers.catchResultQuery(queryName,e,r)
        db.closeClient()
    })
}