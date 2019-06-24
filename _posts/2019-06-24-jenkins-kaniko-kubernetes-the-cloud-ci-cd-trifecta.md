---
id: 666
author: Akash
layout: post
permalink: /jenkins-kaniko-kubernetes-cloud-ci-cd/
categories:
  - Automation
tags:
  - jenkins
  - kubernetes
  - kaniko
  - jenkinsfile
  - dind
---

Running Jenkins on Kubernetes unleashes the scalability powers of Jenkins and makes it easier to replicate and set it up. It involves running a Jenkins Master server ([jenkinsci/blueocean](https://hub.docker.com/r/jenkinsci/blueocean)) as a StatefulSet and connecting it with the Kubernetes cluster so that the master can spawn "jenkins slaves" on the K8S cluster whenever a build job is triggered. These slaves are nothing but K8S pods consisting of containers based on the [jenkinsci/jnlp-slave](https://hub.docker.com/r/jenkinsci/jnlp-slave) docker image from Docker Hub. 
<center><img src="/assets/images/jenkins-kubernetes-logo.svg" height="400" width="400"  alt="jenkins-with-kubernetes-hat"></center>
<!--more-->

Without further ado, here's how you can run Jenkins on Kubernetes: 
1. Create a **Dockerfile** for Jenkins master based on ```jenkinsci/blueocean``` and install the **Kuberentes plug-in** inside it along with any other optional plug-ins. Build this image and push it to a docker registry 
  * Refer: [Dockerfile.jenkins.master](https://github.com/slashr/jenkins-on-kubernetes/blob/master/Dockerfile.jenkins.master)

2. Next deploy the Jenkins master image on a pod on Kubernetes. Note that although you can create a normal kuberentes ```Deployment``` for this, it is recommended that you create a ```StatefulSet``` instead. This ensures the state and configuration of the pod is maintained. In addition to it being a StatefulSet a ```PersistentVolume``` and a ```PersistentVolumeClaim``` is required to maintain the data stored inside the Jenkins master. 

   With the above setup, even if we terminate the pods running Jenkins master, the state and data will persist and the new pod will launch with the existing settings in place. 
   
   Refer to this manifest to understand how to setup a PV and PVC: [persistent-volume.yaml](https://github.com/slashr/jenkins-on-kubernetes/blob/master/persistent-volume.yaml) Make sure to replace ```spec.awsElasticBlockStore.volumeID``` with your own EBS volume ID.
 
3. Next, create a service for the master Jenkins server and the slaves. Service type for master should be ```LoadBalancer``` and for slaves should be ```ClusterIP```. The ports required on the master are 80 (optionally 443) and on the slaves port 50000 (default JNLP port for communication between master and the slave). Refer the following file: [jenkins-service.yml](https://github.com/slashr/jenkins-on-kubernetes/blob/master/jenkins-service.yml)
4. Open the Jenkins dashboard using the LoadBalancer URL of the master Jenkins pod and go to system configuration. At the end of the page, click on ```Add a New Cloud``` and click on Kubernetes.
5. Enter the Kubernetes ```Cluster API``` in ```Kubernetes URL```, username/password of the cluster in the ```credentials``` section, and ```ClusterIP``` of the slave service in ```Jenkins Tunnel```. This integrates our Jenkins server with the Kubernetes cluster and enables it to launch slave pods on it
6. Next, we need to define the pod template for the slaves that will build our application. This is best done from inside the Jenkinsfile. You can find the Jenkinsfile template here: [Jenkinsfile](https://github.com/slashr/jenkins-on-kubernetes/blob/master/Jenkinsfile) 
As you can see, we have three containers running in the pod.
  * **Kaniko**: For building our docker images and pushing them to our ECR registry
  * **kubectl**: To deploy our application on Kubernetes
  * **jnlp-slave**: The jenkins slave container although not defined in the Jenkinsfile is automatically created inside the pod by Jenkins master.

	We have four volumes:

    * **kube-config**: It's the ~/.kube/config file of your Kubernetes cluster and is mounted on the kubectl container for authentication to the K8S cluster

    * **aws-secret**: It's the ~/.aws/credentials file required by Kaniko to authenticate with ECR and publish the docker images

    * **podlabel**: this is a variable we use to uniquely name the pods that will be spawned. If we don't use it, then there are problems creating pods parallel for each job in the queue.

    * **docker-config**: It's a simple JSON file consisting of the ECR registry endpoint. Example: [https://github.com/slashr/jenkins-on-kubernetes/blob/master/docker-registry-config.yaml](https://github.com/slashr/jenkins-on-kubernetes/blob/master/docker-registry-config.yaml)
Note that for registries other an ECR such as GCR, you would need an additional "authentication token" inside this file.

7. **Connecting Jenkins with the Kubernetes cluster**
To provide Jenkins access to the Kubernetes cluster so that it can create pods for every build job, perform the following steps
    1. Click on **Manage Jenkins** on the Jenkins homepage and then click on **Configure System**  
    2. Disable the workers on the master Jenkins pod **# of executors** to 0. This ensures that build jobs are run solely on slaves and not on the master
    3. Scroll down to the end of the page and click on **Add a new cloud** and then click on Kubernetes. 
    4. Enter 
     * **Name** for the cluster
     * **Kubernetes URL** E.g https://api.kube-cluster.example.com. You can find your API endpoint by running ```kubectl cluster-info```
     * **Kubernetes Namespace**: It's the namespace where you deployed your Jenkins master pod
     * **Credentials**: Enter the username/password of your cluster (located in ~/.kube/config). Click on **Test Connection** to see if the credentials are correct and Jenkins is able to connect to Kubernetes.
     * **Jenkins URL**: Enter the endpoint of your Jenkins Master service (could be an ELB URL or a custom domain)
     * **Jenkins Tunnel**: Enter the endpoint of your Jenkins Slave service created earlier. It's usually a cluster IP along with a port (usually 5000). It should look like 100.76.43.23:50000. The Jenkins master connects to the Kubernetes cluster using this endpoint.
     
     Leave everything else as it is and then click on **Save**.

8. Now that Jenkins and Kubernetes setup is complete, we can create a Multibranch Pipeline and see the pods being spawned for builds in action! Simply click on **New Item** on the Jenkins Homepage, enter a name for the project and click on **Multibranch Pipeline** and click OK. 
9. Click on **Add Source** and your git repository. Click on Save and then Jenkins will start scanning your repository and adding all branches which contain a Jenkinsfile in the root directory. 
10. That's it! You will see a few pods being spawned already for the new branches. From now onwards, pods will be spawned on Kubernetes for every build and terminated after the build is finished 
