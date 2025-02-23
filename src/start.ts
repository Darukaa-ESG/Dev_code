
const { spawn } = require('child_process');

// Start the React development server
const frontend = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend server
const backend = spawn('node', ['src/server.ts'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  frontend.kill();
  backend.kill();
  process.exit();
});
