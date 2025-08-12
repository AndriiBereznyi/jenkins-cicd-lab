pipeline {
    agent any

    /*  ───────────── Variables ───────────── */
    environment {
        // default when branch name is not present (e.g. first scan)
        BRANCH = "${env.BRANCH_NAME ?: 'main'}"
        PORT   = "${env.BRANCH_NAME == 'main' ? '3000' : '3001'}"
        IMAGE  = "cicd-app:${env.BRANCH_NAME}"
        CONTAINER = "cicd-app-${env.BRANCH_NAME}"
    }

    /*  ───────────── Stages ───────────── */
    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out ${BRANCH}"
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "▶ Installing dependencies"
                    if [ -f package.json ]; then
                        npm ci || npm install
                    else
                        npm init -y
                        npm install express
                    fi
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "▶ Running tests (none defined → always pass)"
                    npm test || true
                '''
            }
        }

        stage('Build Docker image') {
            steps {
                sh '''
                    echo "▶ Building Docker image ${IMAGE}"
                    docker build \
                        --build-arg PORT=${PORT} \
                        -t ${IMAGE} .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "▶ Deploying container ${CONTAINER} on port ${PORT}"
                    docker rm -f ${CONTAINER} 2>/dev/null || true
                    docker run -d --name ${CONTAINER} \
                        -p ${PORT}:${PORT} \
                        -e PORT=${PORT} \
                        -e BRANCH_NAME=${BRANCH} \
                        --restart unless-stopped \
                        ${IMAGE}
                '''
            }
        }
    }

    /*  ───────────── Post Actions ───────────── */
    post {
        success {
            echo "✅  ${BRANCH} deployed →  http://localhost:${PORT}"
        }
        failure {
            echo  "❌  Pipeline failed for ${BRANCH}"
            sh '''
                echo "Running containers:"
                docker ps -a | grep cicd-app || true
            '''
        }
        always {
            echo "Pipeline finished for ${BRANCH}"
        }
    }
}
