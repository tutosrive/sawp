import * as core from '@actions/core'
import * as github from '@actions/github'
import 'dotenv/config'
import {getEnvVars} from './utils/env.utils.ts'
import rung from './github/run.ts'
import runs from './supabase/run.ts'
import {writeFile} from 'node:fs/promises'
import {readFile} from 'node:fs/promises'
//import createInsertQuery from './supabase/query.ts'

async function run(){
    //getEnvVars()
    try{
        const data = await rung()
        //await writeFile('app/data.json', JSON.stringify(data))
        //let data = await readFile('app/data.json', 'utf8')
        //data = JSON.parse(data)
        if(data.user && data.repositories){
            const dataPushed = await runs(data)
        }else{
            throw new Error("Data is not valid ...")
        }
        //const dt = JSON.parse(data)
        //createInsertQuery(dt)
    } catch(e){
        console.error("Has happend an error getting Data:")
        console.error(e)
    }
}

run()