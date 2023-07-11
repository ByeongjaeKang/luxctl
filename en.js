const prog_description = 'Control brightness of monitor ambient light.'
const epilog = '* all brightness value should be a percentage number.'
const opts = {
    'r': 'Read current brightness from dimmer.',
    's': 'Set a new brightness value.',
    're': 'Read current initial brightness from EEPROM.',
    'se': 'Set a new initial brightness value to EEPROM.',
    'v': "Show program's version number and exit.",
    'h': 'Show this help message and exit.'
}
const result = {
    'r': '💡 current brightness is at ',
    's': '💡 brightness has been set to ',
    're': '🔍 current power-on brightness value on EEPROM is at ',
    'se': '💾 power-on brightness value on EEPROM has been set to '
}
const error = {
    'unknown': 'Something went wrong.'
}
module.exports = { prog_description, epilog, opts, result, error }