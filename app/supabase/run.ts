import DB from '../database/db.ts'

export default async function runs(data){
    const db = new DB()
    console.log(`Running supabase with data from user "${data.user.login}" ...`)
   // await db.addData('test1', null)
}