## Setting Up FluxCD with Minikube and Jenkins Pipeline
Step 1: Set up Docker Desktop for Windows.
 
Step2:  Set up Minikube Cluster and start:
 
```minikube start```

Step 3. Install Flux CLI on local machine.

Step4. Map FluxCD to the Correct Minikube Cluster

```  kubectl config use-context minikube```

Step5. Created Dockerfile to deploy node application
```
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install --only=production
  COPY . .
  EXPOSE 80
  CMD ["node", "app.js"]
```
Step6. Created Unit tests.(test/unit.test.js)
```
const { greetUser } = require('../app.js');

describe('Unit test greetUser()', () => {
  test('returns greeting message', () => {
    expect(greetUser('Kirti')).toBe('Hello, Kirti!');
    expect(greetUser('John')).toBe('Hello, John!');
  });
});
```
Steps7. Created Integration Test(test/integration.test.js)
```
const request = require('supertest');
const { app } = require('../app.js');

describe('Integration test GET /greet/:name', () => {
  test('responds with greeting message', async () => {
    const res = await request(app).get('/greet/Kirti');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, Kirti!');
  });
});
```

Step8. Created Jenkinsfile to clone github repository, Install required dependencies , Run Unit tests, Run Integration Tests, Building DockerImage, Pushing Docker Image to DockerHub and Updating GitOps Deployment YAML.
```
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
                    cd $WORKSPACE/k8s
                    echo $PWD
                    sed -i "s|image: .*|image: $DOCKER_IMAGE|" deployment.yaml
                    git add deployment.yaml
                    git commit -m "Update image to $DOCKER_IMAGE"
                    git push origin main
                     '''
    }
}

    }
}

```

Step 9. Bootstrap the Flux CD with github repo and K8s:

```flux bootstrap github --owner=Kirti160598 --repository=Jenkins-and-FluxCD --branch=main --path=./k8s --personal```

 It will ask Personal Github Token generate from github and apply.
 
While bootstrapping it will install and initialize the flux CD inside k8s cluster.

Step 10.Inspect the Flux pods and logs:

```kubectl get pods -n flux-system```

```kubectl logs -n flux-system deploy/kustomize-controller```

Step11. Observe Flux Reconciliation

After pushing changes to GitHub:

```flux get kustomizations -A```

To see the sync status, last applied revision, and any errors.

Example:

```flux get kustomizations -n flux-system```

Step 12. Manual trigger reconciliation:

```flux reconcile kustomization flux-system --with-source```

