#!/usr/bin/env node

/**
 * Node.js wrapper to start the Python FastAPI chatbot backend
 * This allows using 'npm start' to launch the Python server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 CareerGenAI Python Backend Starter');
console.log('=' .repeat(50));

// Check if Python is available
function checkPython() {
    return new Promise((resolve) => {
        const python = spawn('python', ['--version']);
        python.on('close', (code) => {
            if (code === 0) {
                resolve('python');
            } else {
                // Try python3
                const python3 = spawn('python3', ['--version']);
                python3.on('close', (code) => {
                    resolve(code === 0 ? 'python3' : null);
                });
            }
        });
    });
}

// Check if required files exist
function checkFiles() {
    const requiredFiles = ['chatbot.py', 'requirements.txt'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        console.error('❌ Missing required files:', missingFiles.join(', '));
        return false;
    }
    return true;
}

// Install Python dependencies
function installDependencies(pythonCmd) {
    return new Promise((resolve) => {
        console.log('📦 Checking Python dependencies...');
        
        const pip = spawn(pythonCmd, ['-m', 'pip', 'install', '-r', 'requirements.txt']);
        
        pip.stdout.on('data', (data) => {
            process.stdout.write(data);
        });
        
        pip.stderr.on('data', (data) => {
            process.stderr.write(data);
        });
        
        pip.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Dependencies ready');
            } else {
                console.log('⚠️  Some dependencies may be missing, but continuing...');
            }
            resolve(true);
        });
    });
}

// Start the Python chatbot server
function startChatbot(pythonCmd) {
    console.log('🤖 Starting CareerGenAI Python Chatbot...');
    console.log('📍 Server will be available at:');
    console.log('   • API: http://localhost:8000');
    console.log('   • Docs: http://localhost:8000/docs');
    console.log('   • Health: http://localhost:8000/health');
    console.log('🔧 Press Ctrl+C to stop');
    console.log('=' .repeat(50));
    
    const chatbot = spawn(pythonCmd, ['chatbot.py'], {
        stdio: 'inherit'
    });
    
    chatbot.on('close', (code) => {
        if (code !== 0) {
            console.log(`\n❌ Chatbot exited with code ${code}`);
        } else {
            console.log('\n✅ Chatbot stopped gracefully');
        }
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping chatbot...');
        chatbot.kill('SIGINT');
    });
    
    return chatbot;
}

// Main execution
async function main() {
    try {
        // Check if required files exist
        if (!checkFiles()) {
            process.exit(1);
        }
        
        // Check Python availability
        const pythonCmd = await checkPython();
        if (!pythonCmd) {
            console.error('❌ Python not found. Please install Python 3.8+ and try again.');
            process.exit(1);
        }
        
        console.log(`✅ Found Python: ${pythonCmd}`);
        
        // Install dependencies
        await installDependencies(pythonCmd);
        
        // Start the chatbot
        startChatbot(pythonCmd);
        
    } catch (error) {
        console.error('❌ Error starting chatbot:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = { main, checkPython, startChatbot };