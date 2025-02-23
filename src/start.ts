
const { spawn } = require('child_process');

// Start the React development server
const frontend = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

// Start the backend server using ts-node
const backend = spawn('ts-node', ['--transpile-only', 'src/server.ts'], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    PORT: '3001',
    NODE_ENV: 'development'
  }
});

process.on('SIGINT', () => {
  frontend.kill();
  backend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  frontend.kill();
  backend.kill();
  process.exit();
});
