---
id: 668
author: Akash
title: 'Observable Kubernetes Cluster Using Grafana-Loki-Prometheus' 
layout: post
permalink: /grafana-loki-prometheus/
categories:
  - Automation
tags:
  - helm
  - kubernetes
  - docker
---

### Introduction ###

With the growing popularity of Kubernetes and the number of options to easily deploy a K8S cluster quickly, organisations are becoming more confident of hosting a SaaS in-house rather than use it as a subscription. 
However, when you ship a Terraform moulded K8S cluster, it is important that you also get visibility into the cluster as well as the application. 

The best way of achieving this is to use Terraform and Helm to install basic apps on the cluster such as the Grafana-Loki-Promtheus stack


<center><img src="../assets/images/eyeofgrafana.png" height="400" width="400"></center>
<!--more-->


### Step 1: 
Use the Terraform Module to install the Loki Helm Chart (with Grafana and Prometheus disabled, and Promtail enabled). This is because when installing Grafana using Loki, it installs a rather outdated version of Grafana. 
Thus it is better to use the Grafana Helm Chart to install the latest version of Grafana and Prometheus. 

### Step 2: 
Configuration of Loki inside Grafana
enabled: true
check_for_updates: false

plugins:
  - grafana-piechart-panel
  - vonage-status-panel

datasources: 
  datasources.yaml:
    apiVersion: 1
    datasources:
    - name: Loki
      type: loki
      access: proxy
      url: http://loki-stack:3100
      jsonData:
        maxLines: 1000
        derivedFields:
         # Field with external link.
          - matcherRegex: "traceID=(\\w+)"
            name: TraceID
            url: 'http://loki-stack:3100'

As you can see, there is also the possiblity of parsing logs using the Derived Fields feature of Loki. This rule would however apply to all logs and it is therefore preferred to do all parsing using Promtail. 

You can add the Loki datasource inside the values.yaml of Grafana so that it is pre-configured. The URL should match the Service name of the Loki stack

### Step 3: 

Optionally, configure Promtail to blacklist unecessary namespaces such as kube-system, monitoring etc. This can be done by adding the following code in every `relabel_configs` part of every job in the Promtail configuration. The best way to do this is to copy the default ConfigMap of Promtail and paste it in the values.yaml file of the Loki Stack under promatil.scrapeConfigs

However, this can become a problem when in the future updates to the ConfigMap template inside the Helm Charts are made and it won't be reflected on your ConfigMap until it is updated manually. So until, we have the ability to drop logs based on namespace, pod-name etc using the Values file, I would advice against doing this. 

      relabel_configs:
      - action: drop
        regex: 'kube-system'
        source_labels:
        - __meta_kubernetes_namespace


### Step 4: 

Next, in order to Parse the logs to extract the most useful information, add a new Job under `promatil.extraScrapeConfigs` in the Values file with the following code:

```
    - job_name: custom_logs_scraping
      kubernetes_sd_configs:
      - role: pod
      pipeline_stages:
      - docker: {}
        # Regex expressions for extraction of specific metrics/keywords from the logs
        - regex:
            expression: '\"traceId\"..\"(?P<traceId>.+?)\"'
        - regex:
            expression: \"ElapsedMilliseconds\"..(?P<responseTime>[\d\.]+)
        - regex:
            expression: '\"StatusCode\"..(?P<statusCode>.\d+)'
        - regex: 
            expression: ^.*(?P<finishedRequests>Request finished).*$
        # Converts extracted values above into log labels
        - labels:
            traceId:
            responseTime:
            statusCode:
            finishedRequests:
        # Creates metrics from the extracted label
        # The metrics can be viewed in Grafana with Prometheus as data source
        - metrics:
            total_finished_requests_counter:
              type: Counter
              description: "Total number of requests finished successfully"
              prefix: myapp_log_metrics_
              source: finishedRequests
              config:
                action: inc
        - metrics:
            http_response_time_milliseconds:
              type: Histogram
              description: "HTTP Request response times"
              prefix: myapp_log_metrics_
              source: responseTime
              config:
                buckets: [0.25,0.5,1.0,1.25,1.5,1.75]
      relabel_configs:
      - action: drop
        regex: 'custom-metrics'
        source_labels:
        - __meta_kubernetes_namespace
      - action: drop
        regex: .+
        source_labels:
        - __meta_kubernetes_pod_label_name
      - source_labels:
        - __meta_kubernetes_pod_label_app
        - __meta_kubernetes_pod_node_name
        target_label: __host__
      - action: drop
        regex: ''
        source_labels:
        - __service__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - action: replace
        replacement: $1
        separator: /
        source_labels:
        - __meta_kubernetes_namespace
        - __service__
        target_label: job
      - action: replace
        source_labels:
        - __meta_kubernetes_namespace
        target_label: namespace
      - action: replace
        source_labels:
```

Using the Regex above, this Job would extract four labels from a log entry that looks like this: 
```
2021-07-15T09:28:20.888238937Z stdout F { "timestamp": "2021-07-15T09:28:20.881Z", "severity": "Info", "message": Request finished in 0.2358ms 200 application/grpc, "traceId": "969814f6-40ac9c957e3abdf8", "additionalData": { "ElapsedMilliseconds": 0.2358, "StatusCode": 200, "ContentType": "application\/grpc"} }
```

traceId: 969814f6-40ac9c957e3abdf8
responseTime: 0.2358
statusCode: 200
finishedRequests: 1

The above snippet of code also has the stage `metrics`. Metrics will use the extracted value specified by `source` and perform an action on it specified by `config.action`. There are three types of metrics available using Promtail currently: Counter, Gauge and Histogram. These metrics will then be read and exposed by Prometheus. 


### Step 5: 
You can create custom Dashboards using the above metrics extracted from your logs in Grafan. Create a new Dashboard, then add a Panel, select Prometheus as the Datasource and then search for the name of the metric exposed (note that it will begin with the prefix "myapp_log_metrics") as specified in the snippet above. 

After creating this Dashoboard, you can export them to a JSON file. Add these JSON files to your repository, and create a ConfigMap with `metadata.labels.grafana_dashboard: "true"` and add the JSON files under `data`. 

This will make Grafana automatically import the dashboards on lauch. Example: https://github.com/pivotal-cf/charts-grafana/blob/master/templates/dashboard-configMap.yaml

Finally, this setup can be packaged into a Helm chart and published in a chart repo. And thus, you can finally add the chart to be deployed using a Terraform Helm module and thus make this monitoring stack plug-and-playable. 


