
const { spawn } = require('child_process');

// Start the React development server
const frontend = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend server using ts-node
const backend = spawn('ts-node', ['--transpile-only', 'src/server.ts'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  frontend.kill();
  backend.kill();
  process.exit();
});
