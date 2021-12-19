---
id: 668
author: Akash
title: 'From Git to Ops: A Handholding Walkthrough' 
layout: post
permalink: /git-to-ops/
categories:
  - Automation
tags:
  - gitops
  - kubernetes
  - argo-cd
  - helm
  - terraform
---

### From Git to Ops

1. Spin up a K8S cluster using Terraform
1. Setup ArgoCD
1. Setup Chart Museum
1. Create a MonoRepo
1. Create a Common Helm Template directory
1. Get Used to (and understand) SemVer
1. Automate your Deployments!

- Spin up a K8S cluster using Terraform
  To an extent, it is Kubernetes that largely enables the possiblity of having infrastructure as code. Paired with Terraform, the need for clicking buttons and navigating through GUIs becomes less and less necessary. 

  So write a Terraform template to spin up a new K8S cluster. Either managed, self-hosted or k3s hosted. Instructions to do this are out of the scope of this tutorial

- Setup ArgoCD
    An important building block of GitOps is how we handle releases and deployments. The recommended way it to have a repository which describes the *state* of a deployment. This state is a declarative way of saying which app do you want to be deployed, which version of the app, which configuration and so on. 

    ArgoCD and Flux both offer these state based deployment models with the exception that ArgoCD offers a UI (very useful in my opinion). 

    ArgoCD offers a Helm chart so let's quickly install it on our cluster

```bash   
helm repo add argo https://argoproj.github.io/argo-helm
helm install argo-cd argo/argo-cd -n argo-cd --create-namespace --values=values.yaml
```

    A basic values.yaml file for the ArgoCD installation is inside the argocd directory on the repo

    Since ArgoCD doesn't support external values.yaml file for Helm charts yet, you can use the `values: |` parameter of Argo release.yaml to specify the values.yaml as a string inside the release.yaml file. 


- Write Helm Charts for your app!
  There is really no better way to handle the deployment, versioning and management of Kuberentes objects than Helm charts. Sure, it is Yet Another Abstraction Layer, but I would claim it's a highly efficient one. 



- Get Used to (and understand) SemVer
	  Semver is a way of systematically managing your app versions. It basically consists of 4 fields out of which 3 are non-optional. For example, 1.4.0-beta is a valid semver where 
	  1 - Major Version representing breaking API changes
	  4 - Minor Version representing backwards compatible changes
	  0 - Patch Versions representing bugfixes 
	  beta - Pre-release tag used to usually deploy and test on non-production environments

	  In the hidden documentations of Semver, you will find how to use pre-release tags in your automated deployments. Here: https://github.com/Masterminds/semver#working-with-prerelease-versions, you will see that in order to deploy a pre-release tag, you will have to use the expression

	  >=1.3.0-0 

	  The result of this expression would be something like 1.3.1-beta
	  Note that the pre-release tag follows the ASCII table for order of precedence which means 1.3.1-ALPHA < 1.3.1-alpha. This is because `a` has higher precedence in the ASCII table than `A`. So to keep it simple, always use lower-case letters for the pre-release tag and also try to keep it as simple as possible.

- Automate your Deployments

	  With the above semver quirks in mind, you are now ready to setup an automatic CD pipeline that goes from dev -> stage -> production

	  You can have your builds tagged with a -dev pre-release tag for test releases. These can then be promoted to -beta staging releases after some testing. 

	  Finally, the -beta artifacts can be promoted to no pre-release production artificats. This can be achieved by having the CI pipeline perform a git commit on the MonoRepo to update the Chart version tag in the values.yaml of the application. 


- Seal your Secrets
      The easiest and quickest way to have a Secret management system is to use Sealed Secrets. Secrets and credentials can become quite annoying when trying to codeify your infrastructure. There's often intermingling dependenices of apps on secrets and on each other that make it very difficult to have a smooth IaaC pipeline. 

      Sealed Secrets addresses this by allowing you to have encrypted secret texts in your code. These Secrets can only be encrypted by a person who has the public/private keypair of the Sealed Secrets operator. So this keypair becomes sort of like a key to your vault of secrets. 

      You can use Terraform to first install the Sealed Secrets operator with a custom keypair (so that you don't have reenrypt your passwords everytime), and then create a SealedSecret CRD with the encrypted Secrets. The SealedSecrets operator will then read this CRD and then unseal into a regular K8S Secret. 


- Notes
* Cert Manager has two types of Cluster Issuers - Staging and Prod
* Certs issued by the Staging server is not recognized by browsers and is as good as a self-signed certificate
* Certs issued by Prod server are recognized and have rate limits on the verification API. So use it only for Production purposes
* Terraform offers a time_sleep resource for creating a delay when waiting on resources like Ingress to populate a public IP
* Terraform data blocks are used to refer to a resource created outside of Terraform/or by a different Terraform template
* Nginx Ingress routes traffic automatically to all underlying Services. So we need just one public facing endpoint (the Nginx Load Balancer IP) to route traffic to all other services. It's basically a reverse proxy
