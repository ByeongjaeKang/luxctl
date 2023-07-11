# luxctl
Control brightness of monitor ambient light.

Prerequisite
------
1. run <code>echo "export DIMMER=/dev/\<your-dimmer-device>" >> ~/.bashrc</code>   
replace <code>\<your-dimmer-device></code> for your device name.

Usage
------
1. <code>-s N</code> set a new brightness value.   
2. <code>-se N</code> write new initial brightness to EEPROM.   
3. <code>-r</code> read current brightness from dimmer.
4. <code>-re</code> read current initial brightness from EEPROM.
5. <code>-v</code> show program's version number and exit
