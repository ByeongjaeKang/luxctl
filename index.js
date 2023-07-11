const { ArgumentParser } = require('argparse')
const { SerialPort } = require('serialport')

const PROG_NAME = 'luxctl'
const VERSION = '1.0'
const BUILD_DATE = '11 July 2023'
const AUTHOR = 'Byeongjae Kang'
const DAC_RESOLUTION_BIT = 8
const DIMMER = process.env.DIMMER

const dimmer = new SerialPort({ path: DIMMER, baudRate: 115200 })

const parser = new ArgumentParser({ prog: PROG_NAME, description: 'Control brightness of monitor ambient light.', epilog: 'all brightness value on luxctl is a percentage number.' })
const group = parser.add_mutually_exclusive_group()

group.add_argument('-s', {
    metavar: 'N', type: 'int', nargs: 1,
    help: 'set a new brightness value.'
})
group.add_argument('-se', {
    metavar: 'N', type: 'int', nargs: 1,
    help: 'write new initial brightness to EEPROM.'
})
group.add_argument('-r', { action: 'store_true', help: 'read current brightness from dimmer.' })
group.add_argument('-re', { action: 'store_true', help: 'read current initial brightness from EEPROM.' })
group.add_argument('-v', { action: 'version', version: `${PROG_NAME} ${VERSION} of ${BUILD_DATE}, by ${AUTHOR}` })

let args = parser.parse_args()

function raw2perc(raw) { return Math.round(raw / ((2 ** DAC_RESOLUTION_BIT - 1) / 100)) }
function perc2raw(perc) { return Math.round(perc * ((2 ** DAC_RESOLUTION_BIT - 1) / 100)) }

function sendCmd(cmd, arg = '', needReturn = false) {
    return new Promise((resolve, reject) => {

        dimmer.write(`${cmd}${arg || ''}\n`, (response) => {
            if (!response && !needReturn) {  // command sent ok && return not needed.
                
                resolve(true)

            } else if (!response && needReturn) {  // command sent ok && return needed.
                dimmer.on('data', (data) => {
                    const resp = data.toString().split("\r\n")[0]
                    resp == 'OK' ? resolve(true) : '' // return true when response is "OK"

                    resolve(resp)
                })
            }
        })
    });
}

async function processArgs() {
    if (args.s) {
        const response = await sendCmd('CTRL', perc2raw(args.s))
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`💡 brightness has been set to ${args.s}%.`)
            : console.error('something went wrong.')

        process.exit()

    } else if (args.se) {
        const response = await sendCmd('SAVE', perc2raw(args.se))
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`💾 power-on brightness value on EEPROM has been set to ${args.se}%.`)
            : console.error('something went wrong.')

        process.exit()

    } else if (args.r) {
        const response = await sendCmd('READ', '', true)
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`💡 current brightness is ${raw2perc(response)}%.`)
            : console.error('something went wrong.')

        process.exit()

    } else if (args.re) {
        const response = await sendCmd('RROM', '', true)
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`🔍 current power-on brightness value on EEPROM is ${raw2perc(response)}%.`)
            : console.error('something went wrong.')

        process.exit()

    } else {
        parser.print_help()
        process.exit()
    }
}
processArgs()