---
id: 452
title: Moving your DNS to Route 53
date: 2016-02-24T19:21:56+00:00
author: Akash
layout: post
permalink: /route-53-use-cases/
image: /wp-content/uploads/2016/02/Route53-e1456448466184.png
categories:
  - AWS
tags:
  - aws
  - dns
  - route 53
---
### About Route 53

Amazon Route 53 is a Domain Name System (DNS) owned and provided by AWS. Being part of the AWS ecosystem, it works well with other services like EC2 instances, Elastic Load Balancing, S3 storage etc compared to other Domain Registrars. So if your infrastructure is completely built on AWS, you should consider moving your DNS to Route 53 since it would help create a homogeneous environment.

---
Here are a few common use-cases along with a broad overview of the process steps:

#### Migrating an existing domain's DNS to Route 53

  1. Create a **Hosted Zone** and enter the existing domain name (www.example.com)
  2. Add a **Record Set** to the **Hosted Zone** and add the IP of the server as a **A record** (also create MX, CNAME and other records depending on your requirement)
  3. Copy the four name servers provided by the **Hosted Zone**
  4. Log in to your domain registrar's control panel/admin console. If your registrar supports TTL modification, It is recommended to set it to 900 seconds for a quicker propagation. Replace your domain registrar's NS records with the four name servers you copied from Route 53.
  5. The DNS propagation from your domain registrar to Route 53 will take 48 hours or more.

---
#### Migrating the sub-domain DNS to Route 53 without migrating the parent domain

  1. Create a **Hosted Zone** and enter the sub domain name (www.aws.example.com)
  2. Add a **Record Set** to the hosted zone and add the IP of the server as a **A record** (similarly add MX, CNAME records if required)
  3. Copy the four name servers provided by the **Hosted Zone**. Replace the NS Records of the registrar with these name servers

**Important**: Do not add a start of authority (SOA) record to the zone file for the parent domain. Reason for this being since the sub-domain will use Amazon Route 53, the DNS service for the parent domain is not the authority for the sub-domain.

---

#### Private Hosted Zone

  1. **Private Hosted Zone** is a **Hosted Zone** for managing domains within an AWS VPC
  2. First step is to set the following Amazon VPC settings to `true`: 
     - enableDnsHostnames
     - enableDnsSupport
  3. On the Route 53 page, click on **Create Hosted Zone**.
  4. Next, in the **Create Private Hosted Zone** pane, enter your domain name. Select **Private Hosted Zone for Amazon VPC** in the **Type** list.
  5. Finally, in the **VPC ID** list, select the VPC you want to associate with Route 53.
  6. Click on **Create**. Your VPC should get linked with Route 53 within a few minutes.
  
---
#### Integration with other AWS Services
  
  Once a Hosted Zone is created, incorporating other AWS Services into Route 53 is just a matter of creating a few record sets. Here's a list of the record sets needed for the corresponding AWS services.

1. EC2: Create an A record with the Elastic IP of the instance
2. ELB: Add public DNS of the load balancer to a CNAME record
3. CloudFront: Add Distribution URL to a CNAME record
4. S3: Add the Bucket URL to a CNAME record
5. RDS: Add the RDS endpoint to a CNAME record
