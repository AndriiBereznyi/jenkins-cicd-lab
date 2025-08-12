const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const branchName = process.env.BRANCH_NAME || 'unknown';
    const logoPath = path.join(__dirname, 'logo.svg');
    
    let logoExists = false;
    try {
        logoExists = fs.existsSync(logoPath);
    } catch (e) {
        console.log('Logo check error:', e.message);
    }
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jenkins CI/CD - ${branchName.toUpperCase()} Branch</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                    padding: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 { color: #fff; margin-bottom: 30px; }
                .branch-info {
                    background: rgba(255,255,255,0.2);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .logo-container {
                    margin: 30px 0;
                    padding: 20px;
                    background: rgba(255,255,255,0.9);
                    border-radius: 10px;
                }
                .success { color: #4CAF50; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Jenkins CI/CD Pipeline Demo</h1>
                <div class="branch-info">
                    <h2>Branch: ${branchName.toUpperCase()}</h2>
                    <h3>Port: ${port}</h3>
                    <p>Status: <span class="success">✅ Successfully Deployed</span></p>
                </div>
                <div class="logo-container">
                    ${logoExists ? 
                        `<img src="/logo.svg" alt="${branchName} Branch Logo" style="max-width: 300px; height: auto;">` : 
                        `<div style="color: #333; padding: 20px;">
                            <h3>${branchName.toUpperCase()} BRANCH</h3>
                            <p>Logo will appear here when available</p>
                         </div>`
                    }
                </div>
                <p>✅ Deployed via Jenkins Multibranch Pipeline</p>
                <p>🐳 Running in Docker Container</p>
                <small>Build time: ${new Date().toISOString()}</small>
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
    console.log(`🌐 Access at: http://localhost:${port}`);
});
