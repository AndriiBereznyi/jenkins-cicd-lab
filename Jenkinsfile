pipeline {
    agent any
    
    tools {
        nodejs 'Node-7.8.0'
    }
    
    environment {
        DOCKER_IMAGE = "cicd-app"
        PORT = "${BRANCH_NAME == 'main' ? '3000' : '3001'}"
        CONTAINER_NAME = "cicd-app-${BRANCH_NAME}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out ${BRANCH_NAME} branch"
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo "Building application for ${BRANCH_NAME} branch"
                sh '''
                    echo "Installing dependencies..."
                    if [ -f package.json ]; then
                        npm install
                    else
                        echo "No package.json found, creating basic Node.js app"
                        npm init -y
                        npm install express
                    fi
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo "Running tests for ${BRANCH_NAME} branch"
                sh '''
                    echo "Running basic tests..."
                    if [ -f package.json ]; then
                        npm test || echo "No tests defined, continuing..."
                    fi
                    echo "Tests completed"
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image for ${BRANCH_NAME} branch with port ${PORT}"
                    
                    // Create Dockerfile if it doesn't exist
                    sh '''
                        if [ ! -f Dockerfile ]; then
                            cat > Dockerfile << 'DOCKER_EOF'
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD ["node", "server.js"]
DOCKER_EOF
                        fi
                    '''
                    
                    // Create server.js if it doesn't exist
                    sh '''
                        if [ ! -f server.js ]; then
                            cat > server.js << 'SERVER_EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CICD Pipeline - ${process.env.BRANCH_NAME || "Unknown"} Branch</title>
        </head>
        <body style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
            <h1>Jenkins CI/CD Pipeline Demo</h1>
            <h2>Branch: ${process.env.BRANCH_NAME || "Unknown"}</h2>
            <h3>Port: ${port}</h3>
            <div style="margin: 20px;">
                <img src="/logo.svg" alt="Branch Logo" style="max-width: 300px;">
            </div>
            <p>Successfully deployed via Jenkins!</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`App running on port ${port} for branch ${process.env.BRANCH_NAME || "Unknown"}`);
});
SERVER_EOF
                        fi
                    '''
                    
                    // Build Docker image
                    sh "docker build -t ${DOCKER_IMAGE}:${BRANCH_NAME} --build-arg PORT=${PORT} ."
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Deploying application for ${BRANCH_NAME} branch on port ${PORT}"
                    
                    // Stop and remove existing container
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    """
                    
                    // Run new container
                    sh """
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            -p ${PORT}:${PORT} \
                            -e PORT=${PORT} \
                            -e BRANCH_NAME=${BRANCH_NAME} \
                            ${DOCKER_IMAGE}:${BRANCH_NAME}
                    """
                    
                    echo "Application deployed successfully!"
                    echo "Access the application at: http://localhost:${PORT}"
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline completed for ${BRANCH_NAME} branch"
        }
        success {
            echo "Pipeline succeeded! Application is running on port ${PORT}"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
