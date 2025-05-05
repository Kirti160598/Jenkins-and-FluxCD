pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "kirtigupta1234/myapp:${BUILD_NUMBER}"
        GITOPS_REPO = "https://github.com/Kirti160598/Jenkins-and-FluxCD.git"
    }

    stages {
        stage('Checkout App') {
            steps {
                git branch: 'main', url: 'https://github.com/Kirti160598/Jenkins-and-FluxCD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('Run Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Update GitOps Deployment YAML') {
            steps {
                sh '''
                    cd $WORKSPACE
                    echo $PWD
                    sed -i "s|image: .*|image: $DOCKER_IMAGE|" k8s/deployment.yaml
                    git add deployment.yaml
                    git commit -m "Update image to $DOCKER_IMAGE"
                    git push origin main
        '''
    }
}

    }
}
