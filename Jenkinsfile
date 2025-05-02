pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "kirtigupta1234/myapp:${BUILD_NUMBER}"
        GITOPS_REPO = "git@github.com:kirtigupta1234/Jenkins-and-FluxCD.git"
    }

    stages {
        stage('Checkout App') {
            steps {
                git 'git@github.com:yourusername/app-repo.git'
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Update GitOps Deployment YAML') {
            steps {
                sshagent (credentials: ['gitops-ssh-key']) {
                    sh '''
                        git clone $GITOPS_REPO gitops-repo
                        cd gitops-repo
                        sed -i "s|image: .*|image: $DOCKER_IMAGE|" deployment.yaml
                        git add deployment.yaml
                        git commit -m "Update image to $DOCKER_IMAGE"
                        git push origin main
                    '''
                }
            }
        }
    }
}
