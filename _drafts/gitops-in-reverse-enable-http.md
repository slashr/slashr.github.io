---
id: 670
author: Akash
title: 'GitOps: App Improvements and Pipelines' 
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

# GitOps in Reverse
We previously deployed the Podinfo app to our cluster but accessing the app wasn't the most seamless experience as you have to do a kubectl port-forward to see it live in action. To improve the accessibility we need to make some additions so that our app is accessible over a TLS secured HTTP endpoint. 

We'll achieve this in this manner:
1. Install Nginx Ingress Controller on our cluster(#install-nginx-ingress-controller)
2. Enable Ingress on the Podinfo app (#enable-podinfo-ingress)
3. Test if the Ingress is publicly accessible
4. Enable HTTPS using Cert Manager (#enable-https-connection-using-cert-manager)
5. Test provisioning of SSL certs for the Podinfo Ingress
6. Finish!

---
<h2 id="install-nginx-ingress-controller">Install Nginx Ingress Controller on our cluster </h2>
The [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/) comes with a Helm chart. So similar to ArgoCD, we can create a new module in the Terraform code for Nginx Ingress Controller. 

Find the code [here](https://github.com/slashr/git-to-ops/tree/main/terraform/modules/ingress-nginx)

Note: If your Terraform cluster is running on Minikube, you will have to run `minikube tunnel` in a separate shell in order to enable a Proxy to the K8S cluster from your Host machine. This is required so that your computer can forward traffic to the Nginx Ingress controller

With this, we have a way to accept incoming traffic from outside the Kuberentes cluster and redirect them to the appropriate app!

<h2 id="enable-podinfo-ingress">Enable Ingress for the Podinfo app </h2>
Now let's try to enable Ingress on the Podinfo app and see if it creates a HTTP endpoint for us. 

We first add the following block to Podinfo app-manifest under `spec.source.helm.values`
```
        ingress:
          enabled: true
          className: "nginx"
          hosts:
            - host: podinfo.local
              paths:
                - path: /
                  pathType: ImplementationSpecific
```

This creates an Ingress object for Podinfo with the class "nginx" which means Nginx controlls this Ingress and routes traffic to it. The `host` block specifies which hostnames the Ingress will accept. 

Now we need to point `podinfo.local` to the right IP. This would be 127.0.0.1 if you're running Kubernetes on Minikube locally or a Public IP assigned by your Cloud Provider that you can find on the Ingress Nginx Service Object. If running locally, add a entry in `/etc/hosts`: `127.0.0.1   podinfo.local` or `<Ingress-nginx-public-ip>  podinfo.local`

Go to podinfo.local on your browser and voila! You have just exposed the Podinfo app running on your cluster to the outside world (or atleast your world for now)

<h2 id="enable-https-using-cert-manager">Enable HTTPS using Cert Manager </h2>

If you go to https://podinfo.local, you will get a invalid certificate warning since we don't have a way to get a proper CA signed certificate yet. 

For this, we will first enable port 443 traffic on the Ingress. This can be done by simply adding a TLS section to the Podinfo Ingress configuration block. So the `helm` block inside your app manifest for Podinfo should look like this 
```
    helm:
      values: |
        replicaCount: '2'
        ingress:
          enabled: true
          className: "nginx"
          hosts:
            - host: "podinfo.example.com"
              paths:
                - path: /
                  pathType: ImplementationSpecific
          tls:
            - hosts:
                - "podinfo.example.com"
```

When you now access https://podinfo.example.com, you will be able to connect with a HTTPS connection albeit with a warning about an invalid certificate. So let's use Cert Manager and provision a valid certificate

Cert Manager creates a Certificate on the cluster after verifying that the DNS domain indeed belongs to the cluster owner. It does so by either using the HTTP or the DNS challenge. In the HTTP challenge, cert-manager will temporarily create an Ingress and a Pod containing a certain string and expose it to the internet. It will then notify the CA, that the HTTP challenge is ready to be executed and the CA will in turn try to retrieve the string by accessing the corresponding Ingress HTTP endpoint. If sucessful, the domain ownership is established and a certificate is provisioned. 

The DNS challenge on the other hand, creates a TXT record in the DNS Zone of the domain name and then tries to fetch this record from multiple vantage points. If successful, again domain ownership is confirmed. 

The main advantage for using DNS challenge over HTTP is that issuance of wildcar certificates is possible. 

Cert Manager doesn't support all DNS Providers but definitely the ones from major Cloud Providers and Cloudflare. You can setup a free basic account on Cloudflare for your domain's DNS and then generate an API Token which will be stored in Kubernetes Secret. 

```
resource "kubernetes_secret" "cloudflare-api-token" {
  metadata {
    name      = "cloudflare-api-token-secret"
    namespace = "cert-manager"
  }

  data = {
   api-token = var.cloudflare_api_token
  }
}
```

We then reference this Secret inside the ClusterIssuer
```
resource "kubectl_manifest" "issuer-lets-encrypt-staging" {
  yaml_body = <<YAML
# issuer-lets-encrypt-staging.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: akashon1@gmail.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
YAML
}
```

We also need to add an annotation and secret reference to the Ingress of Podinfo inside the app manifest.
```
        ingress:
          ...
          annotations:
            # This lets cert-manager identify which Ingresses to generate a cert for
            cert-manager.io/cluster-issuer: letsencrypt-staging
          ...
          tls:
            - hosts:
                - "myapp.example.com"
              secretName: example-app-tls
```

This annotation helps cert-manager detect the Ingress object that are requesting a certificate.
Now when you apply the changes, Cert Manager will automatically verify the domain ownership with a DNS challenge and then inject a certificate upon successsful verification!
