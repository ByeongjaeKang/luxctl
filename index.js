const { ArgumentParser } = require('argparse')
const fs = require('fs')

const parser = new ArgumentParser({prog: 'luxctl', description: 'Control brightness of monitor ambient light'})
const group = parser.add_mutually_exclusive_group();

group.add_argument('-s', { metavar: 'N', type: 'int', nargs: 1,
                            help: 'an integer which be set as brightness value.' })
group.add_argument('-se', { metavar: 'N', type: 'int', nargs: 1,
                            help: 'write new initial brightness value to EEPROM.'})
group.add_argument('-r', { action: 'store_true', help: 'read current brightness value from dimmer.' })
group.add_argument('-re', { action: 'store_true', help: 'read current initial brightness value from EEPROM.' })
let args = parser.parse_args();

function writeToSerial(cmd) {

}