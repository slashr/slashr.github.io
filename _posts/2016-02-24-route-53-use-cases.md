---
id: 452
title: Moving your DNS to Route 53
date: 2016-02-24T19:21:56+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=452
permalink: /route-53-use-cases/
image: /wp-content/uploads/2016/02/Route53-e1456448466184.png
categories:
  - AWS
tags:
  - aws
  - dns
  - route 53
---
#### About Route 53

Amazon Route 53 is a Domain Name System (DNS) owned and provided by AWS. Since it is a native AWS service, it works well with other services like EC2 instances, Elastic Load Balancing, S3 storage etc. So if your infrastructure is completely built on AWS, you should consider moving your DNS to Route 53 since it would help create a homogeneous environment.

* * *

Here are a few common use-cases along with a broad overview of the process steps:

<ul style="list-style-type: square;">
  <li>
    Migrating an existing domain&#8217;s DNS to Route 53
  </li>
</ul>

  1. Create a **Hosted Zone** and enter the existing domain name (www.skywide.in)
  2. Add a **Record Set** to the **Hosted Zone** and add the IP of the server as a **A record** (also create MX, CNAME and other records depending on your requirement)
  3. Copy the four name servers provided by the **Hosted Zone**
  4. Log in to your domain registrar&#8217;s control panel/admin console. If your registrar supports TTL modification, It is recommended to set it to 900 seconds for a quicker propagation. Replace your domain registrar&#8217;s NS records with the four name servers you copied from Route 53.
  5. The DNS propagation from your domain registrar to Route 53 will take 48 hours or more.

* * *

<ul style="list-style-type: square;">
  <li>
    Migrating the sub-domain DNS to Route 53 without migrating the parent domain
  </li>
</ul>

  1. Create a **Hosted Zone** and enter the sub domain name (www.aws.skywide.in)
  2. Add a **Record Set** to the hosted zone and add the IP of the server as a **A record** (similarly add MX, CNAME records if required)
  3. Copy the four name servers provided by the **Hosted Zone**. Replace the NS Records of the registrar with these name servers

_Important:_ Do not add a start of authority (SOA) record to the zone file for the parent domain. Reason for this being since the sub-domain will use Amazon Route 53, the DNS service for the parent domain is not the authority for the sub-domain.

* * *

<ul style="list-style-type: square;">
  <li>
    Private Hosted Zone
  </li>
</ul>

  1. **Private Hosted Zone** is a **Hosted Zone** for managing domains within an AWS VPC
  2. First step is to Amazon VPC settings to `true`: <div class="itemizedlist">
      <ul class="itemizedlist" type="disc">
        <li class="listitem">
          <code class="code">enableDnsHostnames</code>
        </li>
        <li class="listitem">
          <code class="code">enableDnsSupport</code>
        </li>
      </ul>
    </div>

  3. On the Route 53 page, click on **Create Hosted Zone**.
  4. Next, in the **Create Private Hosted Zone** pane, enter your domain name. Select **Private Hosted Zone for Amazon VPC** in the **Type** list.
  5. Finally, in the **VPC ID** list, select the VPC you want to associate with Route 53.
  6. Click on **Create**. Your VPC should get linked with Route 53 within a few minutes.
  
    * * *

<ul style="list-style-type: square;">
  <li>
    <em>Inte</em>gration with other AWS Services
  </li>
</ul>

Once a Hosted Zone is created, incorporating other AWS Services into Route 53 is just a matter of creating a few record sets. Here&#8217;s a list of the record sets needed for the corresponding AWS services.

<table style="width: 571px;">
  <tr>
    <td style="width: 90px;">
      EC2
    </td>
    
    <td style="width: 469px;">
      Create an <strong>A record</strong> with the <strong>Elastic IP</strong> of the instance
    </td>
  </tr>
  
  <tr>
    <td style="width: 90px;">
      ELB
    </td>
    
    <td style="width: 469px;">
      Add <strong>public DNS</strong> of the load balancer to a <strong>CNAME record</strong>
    </td>
  </tr>
  
  <tr>
    <td style="width: 90px;">
      CloudFront
    </td>
    
    <td style="width: 469px;">
      Add <strong>Distribution URL</strong> to a <strong>CNAME</strong> record
    </td>
  </tr>
  
  <tr>
    <td style="width: 90px;">
      S3
    </td>
    
    <td style="width: 469px;">
      Add the <strong>Bucket URL</strong> to a <strong>CNAME</strong> record
    </td>
  </tr>
  
  <tr>
    <td style="width: 90px;">
      RDS
    </td>
    
    <td style="width: 469px;">
      Add the <strong>RDS endpoint</strong> to a <strong>CNAME</strong> record
    </td>
  </tr>
</table>
