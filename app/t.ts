import {readFile, writeFile} from 'node:fs/promises'

async function test(){
    const data = await readFile('./app/data/data-array-R_kgDON7H4_g.json', 'utf8')
    const resData:Array<any> = JSON.parse(data)
    const wr = []
    resData.forEach(dt =>{
        const i = resData.indexOf(dt)
        wr.push({len: dt.length, ind: i})
    })
    await writeFile('app/tst.json', JSON.stringify(wr, 4))
}

test()