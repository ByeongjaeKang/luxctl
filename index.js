const { ArgumentParser } = require('argparse')
const fs = require('node:fs/promises')

const PROG_NAME = 'luxctl'
const VERSION = '1.0.0'
const BUILD_DATE = '5 July 2023'
const AUTHOR = 'Byeongjae Kang'

const parser = new ArgumentParser({prog: PROG_NAME, description: 'Control brightness of monitor ambient light'})
const group = parser.add_mutually_exclusive_group()

group.add_argument('-s', { metavar: 'N', type: 'int', nargs: 1,
                            help: 'an integer which be set as brightness value.' })
group.add_argument('-se', { metavar: 'N', type: 'int', nargs: 1,
                            help: 'write new initial brightness value to EEPROM.'})
group.add_argument('-r', { action: 'store_true', help: 'read current brightness value from dimmer.' })
group.add_argument('-re', { action: 'store_true', help: 'read current initial brightness value from EEPROM.' })
group.add_argument('-v', { action: 'version', version: `${PROG_NAME} ${VERSION} of ${BUILD_DATE}, by ${AUTHOR}` })

const args = parser.parse_args()

async function serialRW(cmd) {
    const device = await fs.open(process.env.AMBIENT_LIGHT, 'a')
        .then(fulfilled => fulfilled)
        .catch(rejected => false)
    //if(!device) throw new Error('Error occured during opening device.')

    const result = await device.appendFile(cmd)
        .then(() => {
            return true
        })
}

if(args.s) {
    const s = serialRW('CTRL' + args.s + '\n')
} else if(args.se) {
    const s = serialRW('SAVE' + args.se + '\n')
}