---
id: 667
author: Akash
title: 'Migrate from Helm 2 to Helm 3 Safely' 
layout: post
permalink: /migrate-helm2-to-helm3/
categories:
  - Automation
tags:
  - helm
  - kubernetes
  - docker
---

### Introduction ###

As you have probably already read, Helm 2 has been replaced by Helm 3 which comes with a lot of major changes, the biggest being that the Tiller pod has been removed. This is a great security improvement since Tiller was a pod running with a lot of privileges on the cluster and was major point of vulnerability. 

Also, support and upgrades to Helm 2 stopped since November 13, 2020. More information can be found [here](https://helm.sh/blog/helm-v2-deprecation-timeline/). So now is a good time, to finally make that move to Helm 3.


<center><img src="../assets/images/helm.png" height="400" width="400"></center>
<!--more-->


### Setup & Overview

The basic flow of the migration will be as follows
1. Backup data
2. Let Helm 2 continue to handled the Releases
3. Install Helm 3 client and configure it to be able to access the Helm 2 Releases
4. Run a Helm 3 upgrade dry run on the Releases and fix any conflicts
5. Finally run a Helm 3 upgrade on the Releases and if successful, delete Helm 2 & Tiller configuration from the cluster

   **Install the v2 and v3 clients on your machine** 

- Download and save the Helm 3 binary from [here](https://github.com/helm/helm/releases) and save it in your binary path as `helm3`. For example, `mv helm-v3.4.2-darwin-amd64/helm /usr/local/bin/helm3` It's important to name this as helm3 so that you don't confuse the two versions while performing the migration. 
- Similarly, download and save the most recent Helm 2 binary from the releases page and save it as `helm2` in your binary path. Then run `helm2 list` to see if the version is compatible with your Tiller version. If not, then download a older helm2 version accordingly.

   **Backup**

- Install the backup plugin using helm2 `helm plugin install https://github.com/maorfr/helm-backup`
- Next, backup all the namespaces where Helm Releases exist using `helm backup <namespace>`


### Migration
1. Install the migration plugin using helm3 `https://github.com/helm/helm-2to3`
2. There are two major steps to the migration. 
    - Move Config: This copies the configuration of the Releases into the Helm3 config directory. 
    - Convert: This will create links to the Helm2 Releases in the Helm3 config directory so that `helm3` can access them. After this `helm3 list` should show the currently deployed Releases
3. So first, run `helm3 2to3 move config grafana --dry-run` to make sure there are no errors and then subsequently run it without the --dry-run flag. 
4. Next, run `helm3 2to3 convert --dry-run` to ensure a error-free run and then execute the command without the --dry-run flag
5. You should now be able to list the Releases using `helm3 list` 
6. As a safety check, do a `kubectl get pods,svc` on the resources running under the Helm2 Releases. Check the Age of these resources to make sure that they weren't redeployed. 

It's important to note that this migration tool only migrates the Helm2 configuration, not the Kubernetes Resources themselves


### Upgrade Conflicts
Now that you have successfully "copied" the Releases from Helm2 to Helm3, it's time to test how well the migration worked. In my personal experience, some of the Releases work out of the box with Helm3, i.e, running `helm3 upgrade <release>` works as expected and upgrades the Release without anything breaking. 

However, for some Releases, especially the older ones and outdated ones which have gone through several version upgrades that have Breaking Changes, I saw peculiar issues like these. 

Some upgrades failed because of outdated annotations added to the K8S objects by the Helm2 client. To fix this, run `helm3 upgrade grafana stable/grafana --dry-run` and then manually annotate the Objects that are shown as incorrectly annotated as follows in the case of a Grafana chart

`kubectl annotate Deployment grafana "meta.helm.sh/release-name=grafana" "meta.helm.sh/release-namespace=default" --overwrite`

`kubectl label ServiceAccount grafana-test "app.kubernetes.io/managed-by=Helm"`

Similary, run `helm3 upgrade grafana stable/grafana --dry-run` again until the errors disappear and finally run the upgrade without the --dry-run flag

### Conclusion
So while migrating the Releases to Helm3 from Helm2 is pretty much non-breaking and safe to perform, the real challenge is making these migrated Releases compatible with Helm3. Helm3 also uses custom chart repository instead of the old stable/charts central repository. This means that you will have to look up the latest repo URL for your chart and add them Helm3 using `helm repo add <repo-name> <repo-url>`. 

As a best practice, please make sure to go through the Breaking Changes if any of whatever app you are trying to upgrade. Also, perform minor point version upgrades and slowly get to the version you are comfortable with or is stable.

Things get more complicated when upgrading Releases which have Persistent Storage or stuff like MongoDB Deployments. These should be handled much more carefully, making sure to take backups and doing a dry run on a identical setup on a non-production cluster. 

Some Deployments like Nginx-Ingress might be too outdated to be able to maintain them using Helm3. In such cases, it makes sense to create a new Helm Release from scratch rather than spend a lot of hours trying to do a in-place upgrade.



