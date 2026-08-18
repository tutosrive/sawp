import * as core from '@actions/core'
import * as github from '@actions/github'
import 'dotenv/config'
import {getEnvVars} from './utils/env.utils.ts'
import rung from './github/run.ts'
import runs from './supabase/run.ts'

try {
    //getEnvVars()
    rung()
} catch (error) {
    core.error(error)
}