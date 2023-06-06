## Run the MongoDB replicaset within AKS
For this demo, we will be using containerized MongoDB hosted on a StatefulSet in Kubernetes. We will be using Azure Files as the persistent storage. This covers two steps,

1. [Deploying the containerized MongoDB](#deploying-the-containerized-mongodb).
   * [Deploy a storage class](#deploy-a-storage-class)
   * [Deploy the StatefulSet](#deploy-the-statefulset)
   * [Deploy a headless service](#deploy-a-headless-service)
2. [Configuring the replicaset for MongoDB](#configuring-the-replicaset-for-mongodb)
3. [Create the database and an user to access the DB for application](#create-the-database-and-an-user-to-access-the-db-for-application)

### Deploying the containerized MongoDB
For this, we will be using the latest version of MongoDB community version image and deploy 3 replicas.

#### Deploy a storage class
We need to have persistent storage for the database to persist data when a pod is stopped, deleted or evicted. Azure files (files.csi.azure.com) will be used to provision storage dynamically for the pods. The ReclaimPolicy is set to "Retain" to persist the data.

```cmd
# Deploy the storage class

kubectl apply -f mongo-sc.yaml

```

#### Deploy the StatefulSet
The stateful set will be deployed with the following commands to initialize the database,

```
mongod
        - "--bind_ip_all"
        - "--replSet"
        - rs0  # Replica set name
        - "--dbpath"
        - /data/mongofs # Avoid issues by mounting it to a different path than /data/mongo
```

```cmd
# Deploy the statefulset

kubectl apply -f mongo-ss.yaml

```

#### Deploy a headless service

We will be using a headless service which will have the 3 replicas as its endpoint listening on default port.

```cmd

#Deploy the service

kubectl apply -f mongo-svc.yaml

```

### Configuring the replicaset for MongoDB

Once the pods are provisioned, wait for them to come online and verify that they are running,

```cmd

kubectl get po

NAME                       READY   STATUS    RESTARTS      AGE
mongo-0                    1/1     Running   0             68m
mongo-1                    1/1     Running   0             68m
mongo-2                    1/1     Running   0             68m

```

On the first replica, "mongo-0" login and execute the following commands to create a replicaset and publish the 3 instances

``` cmd
#Access the mongo shell inside the first pod

kubectl exec -it mongo-0 -- mongosh admin

# Create a replicaset and publish the 3 instances

rs.initiate()
var cfg = rs.conf()
cfg.members[0].host="mongo-0.mongodb:27017"
rs.reconfig(cfg)
rs.add("mongo-1.mongodb:27017")
rs.add("mongo-2.mongodb:27017")
rs.status()

```

Verify that the 3 instances are healthy and properly displayed as primary(mongo-0)/secondary(mongo-1/2)



### Create the database and an user to access the DB for application

``` sql
#Create a database

use conferencedb

#Create a collection

db.createCollection("conferences")

#Add the application identity and fill the password prompt

db.createUser(
  {
    user: "appUser",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "conferencedb" } ]
  }
)

```

Once this part is completed, copy the connection string of format given below to a key vault

` mongodb://appUser:password@mongo-0.mongodb:27017,mongo-1.mongodb:27017,mongo-2.mongodb:27017/conferencedb?replicaSet=rs0 `

