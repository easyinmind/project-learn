const { platform } = require('os');
const isWindow = platform() === 'win32';

const hooks = {
  'pre-commit': 'lint-staged',
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
};

if (!isWindow) {
  hooks['prepare-commit-msg'] = 'exec < /dev/tty && git cz --hook || true';
}

module.exports = {
  hooks
};
