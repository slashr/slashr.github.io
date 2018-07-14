---
id: 572
title: Analyzing ELB Logs using Elasticsearch and Logstash
date: 2016-06-16T06:50:16+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=572
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
Elasticsearch, Logstash and Kibana (ELK) is a stack widely used for log analytics. The AWS Elasticsearch service lets you run the Elasticsearch and Kibana right out of the box with some manual setup of Logstash required. In this setup, I&#8217;ll walk you through setting up the ELK stack on AWS, enabling ELB logs and analyzing the logs to identify and visualize trends like traffic spikes, top IPs etc.

* * *

#### Setting Up Elasticsearch

  1. Choose a domain name that would be part of the ElasticSearch endpoint. For example, _skywide_.
  2. Select the number of instances in the cluster. Ideally select atleast 2 nodes so that the sharding works. Leave the rest of the options as it is and click **Next**.
  3. Under **Set up access policy,** select **Allow open access to the domain. **This will allow anyone to access your endpoint. Since we are only testing this, you can go ahead with this option. However, a production environment would require more restrictive access policies. Click **Next** and then **Confirm and Create. **
  4. The domain will take around 5 to 10 minutes to get created.
  5. Meanwhile, enable Access Logs on ELB by following [this guide](https://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/enable-access-logs.html).

* * *

#### Setting Up Logstash

  1. Configuring Logstash <ul style="list-style-type: square;">
      <li>
        <code>sudo apt-get update && sudo apt-get upgrade</code>
      </li>
    </ul>

  2. Logstash requires Java on the machine. Install Java by <ul style="list-style-type: square;">
      <li>
        <code>sudo apt-get install default-jdk</code>
      </li>
    </ul>

  3. Add Logstash Package Repositories to your sources list. Verify that you&#8217;re getting the latest repository info on [this page](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories) <ul style="list-style-type: square;">
      <li>
        <code>echo "deb https://packages.elastic.co/logstash/2.3/debian stable main" | sudo tee -a /etc/apt/sources.list. </code>
      </li>
    </ul>

  4. Update your packages and install Logstash: <ul style="list-style-type: square;">
      <li>
        <code>sudo apt-get update && sudo apt-get install logstash</code>
      </li>
    </ul>

  5. Add your AWS IAM Access Key and Secret Key by using environment variables: <ul style="list-style-type: square;">
      <li>
        <code>echo AWS_ACCESS_KEY_ID=AKIAACCESSKEY</code>
      </li>
      <li>
        <code>echo </code><code>WS_SECRET_ACCESS_KEY=tUx2SECRETKEYACk32</code>
      </li>
    </ul>

  6. Create a Logstash configuration file and enter the Elasticsearch endpoint and S3 bucket name in it. Store this file as <ul style="list-style-type: square;">
      <li>
        <code>/etc/logstash/conf.d/logstash.conf</code>
      </li>
    </ul>

  7. Run Logstash: <ul style="list-style-type: square;">
      <li>
        <code>/opt/logstash/bin/logstash -f /etc/logstash/conf.d/logstash.conf</code>
      </li>
    </ul>

* * *

#### Setting Up Kibana

<ul style="list-style-type: disc;">
  <li>
    Open Kibana from the URL provided on the Elasticsearch console.
  </li>
  <li>
    Use the index pattern <em>elb_logs</em>
  </li>
  <li>
    Use the timestamp <em>@timestamp</em>
  </li>
  <li>
    To get started with visualizing your data, read through the <a href="https://www.elastic.co/guide/en/kibana/current/visualize.html">Visualize section</a> of Elastic&#8217;s official documentation.
  </li>
</ul>
