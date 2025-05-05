pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "kirtigupta1234/finos-traderx:${BUILD_NUMBER}"   
        GITOPS_REPO = "https://github.com/Kirti160598/finos-traderX.git"
    }

    stages {
        stage('Checkout App') {
            steps {
                git branch: 'main', url: 'https://github.com/Kirti160598/finos-traderX.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('database') {  // 👈 change working directory to 'database'
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
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
                dir('database') {  // 👈 update deployment.yaml inside 'database'
                    sh '''
                        echo "Current Directory: $(pwd)"
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
