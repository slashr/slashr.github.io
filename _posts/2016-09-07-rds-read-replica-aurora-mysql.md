---
id: 614
title: RDS Read Replica for Aurora using MySQL
date: 2016-09-07T09:03:15+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=614
permalink: /rds-read-replica-aurora-mysql/
image: /wp-content/uploads/2016/09/2000px-AWS_Simple_Icons_Database_Amazon_RDS_DB_Instance_Read_Replica.svg_.png
categories:
  - AWS
  - Ops
tags:
  - aurora
  - aws
  - devops
  - mysql
  - rds
---
Default Read Replicas provided by AWS are instances which should be of the same instance type as the master DB or higher. This might not always be an ideal solution since read replica servers do not require significant computing power. As an alternative, one can create a read replica on a standalone EC2 instance or a RDS DB instance. In the following scenario, we'll create a read replica running on MySQL syncing with a master DB running on Amazon Aurora. The replica instance type can be any type as seen fit by the user.
<!--more-->
* * *

### Configure Master DB for replication

  1. #### Enable Binary Logging on master
    
      * On the RDS Dashboard, click on **Parameter Groups** on the left and then click on **Create Parameter Group**. Under **Type,** select DB Cluster Parameter Group. Enter a relevant **Group Name** and **Description** and click **Create**.
      * Next, select the Parameter Group just created and click on **Edit Parameters.** Then, under **binlog_format**, change from **OFF** to **MIXED.**Click **Save Changes**
      * Click on **Clusters** on the RDS Dashboard, select the (master DB) cluster and click on **Modify Cluster.** Under DB Cluster Parameter Group, select the Parameter Group just created. Click on **Continue** and then on **Modify Cluster.** The instance may reboot or become briefly inaccessible.
  2. #### Retain binary logs. Set retention period
    
      * To do this, login to the master DB and run the following command:

         <code> CALL mysql.rds_set_configuration('binlog retention hours', 144); </code>
           
      * Run `SHOW BINARY LOGS` to ensure that logs are being retained.
  3. #### Create snapshot of master and restore from snapshot.
      * Create a snapshot of the master DB cluster. Restore from the snapshot a new RDS instance having the same parameter group as the master DB cluster (so that binary logging is enabled).
      * Connect to the newly created cluster and run `SHOW MASTER STATUS` command. Retrieve the current binary log file name from the <code>File</code> field and the log file position from the<code>Position</code> field. Save these values for when you start replication.
      * Create a dump of the database. Use the following command:

          <code> mysqldump -databases (database-name) -single-transaction -order-by-primary -r backup.sql -u (database-username) -host=(database-address) -p </code>
      * After the dump is created, delete the restored DB cluster.

* * *

### Configure Slave DB for replication

  1. Launch a MySQL RDS instance.
  2. Connect to this MySQL RDS instance (slave DB) and restore the dump (source backup.sql)
  3. Enable replication by running the following queries (given in the [AWS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/AuroraMySQL.Replication.MySQL.html)) on the master DB.

      <code> 
             CALL mysql.rds_set_external_master ("(master-db-endpoint)", 3306,"(username)", "(password)", "(binary-log-file-name-from-step-3)", (log-file-position-from-step-3), 0); 
             CALL mysql.rds_start_replication;
             CALL mysql.rds_start_replication;
      </code>
  4. Finally, run SHOW SLAVE STATUS command on the replica and check **Seconds behind master.** If the value is 0, it means there is no replica lag. When the replica lag is 0, reduce the retention period by setting the parameter binlog _retention hours_ to a smaller time frame.
