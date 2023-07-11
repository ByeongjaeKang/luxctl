const { ArgumentParser } = require('argparse')
const { SerialPort } = require('serialport')
const strings = require(`./${process.env.LANGUAGE.split(':')[1]}.js`)

const PROG_NAME = 'luxctl'
const VERSION = '1.0'
const BUILD_DATE = '11 July 2023'
const AUTHOR = 'Byeongjae Kang'
const DAC_RESOLUTION_BIT = 8
const DIMMER = process.env.DIMMER

const dimmer = new SerialPort({ path: DIMMER, baudRate: 115200 })

const parser = new ArgumentParser({ prog: PROG_NAME, description: strings.prog_description,
    epilog: strings.epilog, add_help: false })
const group = parser.add_mutually_exclusive_group()

group.add_argument('-s', {
    metavar: 'N', type: 'int', nargs: 1,
    help: strings.opts.s
})
group.add_argument('-se', {
    metavar: 'N', type: 'int', nargs: 1,
    help: strings.opts.se
})
group.add_argument('-r', { action: 'store_true', help: strings.opts.r })
group.add_argument('-re', { action: 'store_true', help: strings.opts.re })
group.add_argument('-v', { action: 'version', version: `${PROG_NAME} ${VERSION} of ${BUILD_DATE}, by ${AUTHOR}`, help: strings.opts.v })
group.add_argument('-h', '--help', { action: 'help', help: strings.opts.h })

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
            console.log(`${strings.result.s}${args.s}%`)
            : console.error(strings.error.unknown)

        process.exit()

    } else if (args.se) {
        const response = await sendCmd('SAVE', perc2raw(args.se))
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`${strings.result.se}${args.se}%`)
            : console.error(strings.error.unknown)

        process.exit()

    } else if (args.r) {
        const response = await sendCmd('READ', '', true)
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`${strings.result.r}${raw2perc(response)}%`)
            : console.error(strings.error.unknown)

        process.exit()

    } else if (args.re) {
        const response = await sendCmd('RROM', '', true)
            .then((r) => { return r })
            .catch((e) => { return e })

        response ?
            console.log(`${strings.result.re}${raw2perc(response)}%`)
            : console.error(strings.error.unknown)

        process.exit()

    } else {
        parser.print_help()
        process.exit()
    }
}
processArgs()