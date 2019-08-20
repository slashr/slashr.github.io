---
id: 572
title: Analyzing ELB Logs using Elasticsearch and Logstash
date: 2016-06-16T06:50:16+00:00
author: Akash
layout: post
permalink: /elb-logs-using-elk/
image: /wp-content/uploads/2016/06/LogstashElasticsearchKibana.png
categories:
  - AWS
  - Logging
tags:
  - analytics
  - aws
  - elasticsearch
  - elb
  - kibana
  - logstash
---
Elasticsearch, Logstash and Kibana (ELK) is a stack widely used for log analytics. The AWS Elasticsearch service lets you run the Elasticsearch and Kibana right out of the box with some manual setup of Logstash required. In this setup, we'll walk through setting up the ELK stack on AWS, enabling ELB logs and analyzing the logs to identify and visualize trends like traffic spikes, frequently vistitor IPs etc.

* * *

#### Setting Up Elasticsearch

  1. Choose a domain name that would be part of the ElasticSearch endpoint. For example, _mysite_.
  2. Select the number of instances in the cluster. Ideally select atleast 2 nodes so that the sharding works. Leave the rest of the options as it is and click **Next**.
  3. Under **Set up access policy,** select **Allow open access to the domain. **This will allow anyone to access your endpoint. Since we are only testing this, you can go ahead with this option. However, a production environment would require more restrictive access policies. Click **Next** and then **Confirm and Create. **
  4. The domain will take around 5 to 10 minutes to get created.
  5. Meanwhile, enable Access Logs on ELB by following [this guide](https://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/enable-access-logs.html).

* * *

#### Setting Up Logstash

  1. Update and upgrade your system packages: 
      ``sudo apt-get update && sudo apt-get upgrade``

  2. Logstash requires Java on the machine. Install Java: 
      ``sudo apt-get install default-jdk``

  3. Add Logstash Package Repositories to your sources list. Verify that you're getting the latest repository info on [this page](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories)
  
      Run: ``echo "deb https://packages.elastic.co/logstash/2.3/debian stable main" | sudo tee -a /etc/apt/sources.list``

  4. Finally, update your packages again and install Logstash:
      ``sudo apt-get update && sudo apt-get install logstash``

  5. Add your AWS IAM Access Key and Secret Key by using environment variables: 
      ``echo AWS_ACCESS_KEY_ID=AKIAACCESSKEY``
      
      ``echo AWS_SECRET_ACCESS_KEY=tUx2SECRETKEYACk32``
      
  6. Create a Logstash configuration file and enter the Elasticsearch endpoint and S3 bucket name in it. Store this file as ``/etc/logstash/conf.d/logstash.conf``

  7. Run Logstash:
      ``/opt/logstash/bin/logstash -f /etc/logstash/conf.d/logstash.conf</code>``
* * *

#### Setting Up Kibana

  1. Open Kibana from the URL provided on the Elasticsearch console. 
      - Use the index pattern *elb_logs*
      - Use the timestamp *@timestamp*

  2. To get started with visualizing your data, read through the [Visualize section](https://www.elastic.co/guide/en/kibana/current/visualize.html) of Elastic's official documentation.