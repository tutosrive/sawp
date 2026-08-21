import * as core from '@actions/core'
import * as github from '@actions/github'
import 'dotenv/config'
import {getEnvVars} from './utils/env.utils.ts'
import rung from './github/run.ts'
import runs from './supabase/run.ts'

async function run(){
    //getEnvVars()
    try{
        const data = await rung()
        if(data.user && data.repositories){
            const dataPushed = await runs(data)
        }else{
            throw new Error("Data is not valid ...")
        }
    } catch(e){
        console.error("Has happend an error getting Data:")
        console.error(e)
    }
}

run()