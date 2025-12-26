pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "node-k8s-ci-cd/node-k8s"
        KUBECONFIG = "${HOME}/.kube/config"
    }

    stages {

        stage("Checkout Code") {
            steps {
                git branch: 'main',
                    url: 'https://github.com/jeevan520/node-k8s-ci-cd.git'
            }
        }

        stage("Build Docker Image") {
            steps {
                sh '''
                  docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .
                  docker tag $DOCKER_IMAGE:$BUILD_NUMBER $DOCKER_IMAGE:latest
                '''
            }
        }

        stage("Push Docker Image") {
            steps {
                withDockerRegistry(
                    credentialsId: 'dockerhub-creds',
                    url: 'https://index.docker.io/v1/'
                ) {
                    sh '''
                      docker push $DOCKER_IMAGE:$BUILD_NUMBER
                      docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                sh '''
                  kubectl apply -f k8s/
                  kubectl set image deployment/node-app \
                    node-app=$DOCKER_IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage("Verify Deployment") {
            steps {
                sh '''
                  kubectl rollout status deployment/node-app
                  kubectl get pods
                  kubectl get svc
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully"
        }
        failure {
            echo "❌ CI/CD pipeline failed"
        }
    }
}
