
import { spawn } from 'child_process';

// Start the React development server
const frontend = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend server
const backend = spawn('ts-node', ['src/server.ts'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  frontend.kill();
  backend.kill();
  process.exit();
});
