const prog_description = '모니터 간접등의 밝기를 제어합니다.'
const epilog = '* 모든 밝기값은 백분율로 나타내어야 합니다.'
const opts = {
    'r': '현재 설정된 밝기값을 확인합니다.',
    's': '밝기값을 재설정합니다.',
    're': '부팅 시 밝기값을 EEPROM에서 불러옵니다.',
    'se': '새로운 부팅 시 밝기값을 EEPROM에 설정합니다.',
    'v': '프로그램의 버전 정보를 표시하고 종료합니다.',
    'h': '이 도움말을 표시하고 종료합니다.'
}
const result = {
    'r': '💡 현재 설정된 밝기값: ',
    's': '💡 밝기를 다음과 같이 설정했습니다: ',
    're': '💾 현재 부팅 시 밝기값은 다음과 같습니다: ',
    'se': '💾 부팅 시 밝기값을 다음과 같이 재설정했습니다: '
}
const error = {
    'unknown': '오류가 발생했습니다.'
}
module.exports = { prog_description, epilog, opts, result, error }