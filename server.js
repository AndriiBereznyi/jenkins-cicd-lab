const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const branchName = process.env.BRANCH_NAME || 'unknown';
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jenkins CI/CD - ${branchName.toUpperCase()}</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; 
                       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; min-height: 100vh; margin: 0; }
                .container { background: rgba(255,255,255,0.1); padding: 40px; 
                           border-radius: 15px; max-width: 600px; margin: 0 auto; }
                .success { color: #4CAF50; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Jenkins CI/CD Pipeline Demo</h1>
                <h2>Branch: ${branchName.toUpperCase()}</h2>
                <h3>Port: ${port}</h3>
                <p>Status: <span class="success">✅ Successfully Deployed</span></p>
                <img src="/logo.svg" alt="${branchName} Logo" style="max-width: 300px;">
                <p>✅ Deployed via Jenkins Pipeline</p>
                <p>🐳 Running in Docker Container</p>
            </div>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        branch: process.env.BRANCH_NAME || 'unknown',
        port: port,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 App running on port ${port} for branch ${process.env.BRANCH_NAME || 'unknown'}`);
});
