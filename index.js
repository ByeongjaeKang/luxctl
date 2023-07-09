const { ArgumentParser } = require('argparse')
const { SerialPort } = require('serialport')

const PROG_NAME = 'luxctl'
const VERSION = '1.0.0'
const BUILD_DATE = '7 July 2023'
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

const dacVal = [args.s, args.se].map(v => perc2raw(v))

function raw2perc(raw) { return Math.round(raw / ((2 ** DAC_RESOLUTION_BIT - 1) / 100)) }

function perc2raw(perc) { return Math.round(perc * ((2 ** DAC_RESOLUTION_BIT - 1) / 100)) }

function sendCmd(cmd, arg, isReturn = false) {
    dimmer.write(`${cmd}${arg || ''}\n`)
    dimmer.on('data', (data) => {
        const response = data.toString().split("\r\n")[0]

        if (response == 'OK') {
            return true

        } else if (isReturn) {
            let raw = parseInt(data.toString().split("\r\n")[0])
            let perc = raw2perc(raw)

            return { raw: raw, perc: perc }
        }
    })
}

async function processArgs() {
    if (args.s) {
        const res = await sendCmd('CTRL', perc2raw(args.s))
            .then(() => true)
            .catch(() => false)

        if (res) {
            console.log(`💡 brightness has been set to ${args.s}%. (PWM ${perc2raw(args.s)})`)
        } else {
            console.error('something went wrong.')
        }
        process.exit()

    } else if (args.se) {
        dimmer.write(`SAVE${dacVal[1]}\n`)
        confirmDeviceResp(`💾 power-on brightness value on EEPROM has been set to ${args.se}%. (PWM ${dacVal})`)

    } else if (args.r) {
        const writeRes = await dimmer.write("READ\n")
        dimmer.on('data', (data) => {
            const raw = parseInt(data.toString().split("\r\n")[0])
            const perc = raw2perc(raw)

            console.log(`💡 current brightness is ${perc}%. (PWM ${raw})`)
            process.exit();
        });

    } else if (args.re) {
        await dimmer.write("RROM\n")
        dimmer.on('data', (data) => {
            const raw = parseInt(data.toString().split("\r\n")[0])
            const perc = raw2perc(raw)

            console.log(`🔍 current power-on brightness is ${perc}%. (PWM ${raw})`)
            process.exit();
        });

    } else {
        parser.print_help()
        process.exit()
    }
}
processArgs()