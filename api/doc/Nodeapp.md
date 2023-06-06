## Sample NodeJS-MongoDB API
This is a sample API app written with NodeJS as the backend and MongoDB (Replicaset) as the database. Current design uses public load balancer service type to expose the app, but the same can be altered to use an ingress controller. The folder structure is as follows,

    |-->nodeapp  # root folder
      |-->api   # application folder
        |-->controllers   # NodeJS controller
          |-->confController.js
        |-->models # NodeJS models
          |-->confModels.js
        |-->routes # NodeJS routes
          |-->confRoutes.js
        |-->doc  # Markdown files
          |-->Nodeapp.md
          |-->MongoDB.md
        |-->kubernetes   # K8S manifests
          |-->app
          |-->mongodb

### Dependencies for the application

1. Express - 4.18.2
2. Mongoose - 7.2.2
3. Nodemon - 2.0.22

### Build the docker image and push to Azure Container Registry
```cmd
#Login to ACR
az acr login -n <acrname> -u adminuser

#Build the image
docker build -t <acrname>.azurecr.io/nodeapp:<version> docker

#Push the image to ACR
docker push <acrname>.azurecr.io/nodeapp:<version>

```

### Deploy the workload to AKS

- akv-msi.yaml - Store the mongoDB connection string in an Azure Key Vault and securely access the secret isnide the pod with CSI drivers.
- nodeapp-deployment.yaml - App deployment manifest
- nodeapp-svc.yaml - Service type of load balancer to expose the application to external users
- nodeapp-ingress - Placeholder for future deployment with an ingress controller, instead of a load balancer

```cmd
#Deploy the CSI SecretClassProvider
kubectl apply -f akv-msi.yaml

#Deploy the app manifest
kubectl apply -f nodeapp-deployment.yaml

#Deploy the service
kubectl apply -f nodeapp-svc.yaml

#Pods should be running
nodeapp-66949bb4b9-pdlg5   1/1     Running   0             62m

#Service will listen on a public IP
NAME          TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
nodeapp-svc   LoadBalancer   10.15.44.43   <public_ip>   80:32252/TCP   54m
```

 For the deployment to be successful, MongoDB replicaset should be deployed. Please follow the document [MongoDB](MongoDB.md) to get the database deployed.

### API Operations

 - /api/getSessions - Returns all sessions
 - /api/newSession - Creates a new session
 - /api/getSession/:id - Gets a session with the specified id
 - /api/deleteSession/:id - Deletes a session with the specified id
 - /api/getSpeakerSessions/:speaker - Gets all sessions for a given speaker
 - /api/getSessionName/:sessionname - Gets all sessions for a given session name



