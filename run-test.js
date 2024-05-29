const { spawn } = require('child_process');

// Start the server
const server = spawn('node', ['src/app.js'], { detached: true });

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
  // Check for a specific server ready message
  if (data.toString().includes('Server started on port 3000')) {
    // Run tests after the server is confirmed to be up
    const tests = spawn('npm', ['run', 'jest:test'], { stdio: 'inherit', shell: true });

    tests.on('close', (code) => {
      console.log(`Tests completed with code ${code}`);

      // Check if the server process is still running before attempting to kill it
      try {
        process.kill(server.pid, 'SIGINT');
      } catch (err) {
        if (err.code === 'ESRCH') {
          console.log(`No process with the PID ${server.pid} was found. It may have already exited.`);
        } else {
          console.error(`Error trying to kill the server process: ${err}`);
        }
      } finally {
        // Exit the parent process after attempting to kill the server process
        process.exit(code);
      }
    });

  }
});

server.on('exit', (code, signal) => {
  console.log(`Server process exited with code ${code}, signal ${signal}`);
});

server.on('close', (code, signal) => {
  console.log(`Server process closed with code ${code}, signal ${signal}`);
});

server.on('error', (err) => {
  console.error(`Server process encountered an error: ${err}`);
});

