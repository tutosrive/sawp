import * as core from '@actions/core'
import {getEnvVars} from './utils/env.utils.ts'
import rung from './github/run.ts'
import runs from './supabase/run.ts'

async function run(){
    try{
        getEnvVars()
        const data = await rung()
        if(data.user && data.repositories){
            core.info(`Will be processed "${data.user.stargazerCount} repositories".`)
            await runs(data)
        }else{
            throw new Error("Data is not valid, missing user and repositories, check username and try again.")
        }
    } catch(e){
        core.error(`Has happend an error getting Data: ${e}`)
    }
}

run()