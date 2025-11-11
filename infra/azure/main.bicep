@description('Location for all resources.')
param location string = resourceGroup().location

@description('Short prefix applied to every resource name to keep them unique.')
param namePrefix string = 'api-errores'

@description('Environment suffix appended to resource names (e.g. dev, qa, prod).')
param environment string = 'dev'

@description('SKU name used for the App Service plan hosting el backend API (por ejemplo P1v2, S1).')
param appServicePlanSkuName string = 'P1v2'

@description('Tier del App Service plan (por ejemplo PremiumV2, Standard).')
param appServicePlanSkuTier string = 'PremiumV2'

@description('Capacidad (número de instancias) del App Service plan.')
@minValue(1)
param appServicePlanCapacity int = 1

@description('Optional IP address range allowed to connect to Cosmos DB. Leave empty to allow from all Azure services.')
param allowedIpRange string = ''

@description('Name of the MongoDB database that stores the error logs.')
param cosmosDatabaseName string = 'errors'

var sanitizedPrefix = toLower(replace(namePrefix, '_', '-'))
var uniqueSuffix = toLower(uniqueString(resourceGroup().id, sanitizedPrefix, environment))
var backendWebAppName = take(toLower('${sanitizedPrefix}-api-${environment}-${uniqueSuffix}'), 60)
var staticWebAppName = take(toLower('${sanitizedPrefix}-ui-${environment}-${uniqueSuffix}'), 60)
var cosmosAccountName = take(replace('${sanitizedPrefix}${environment}${uniqueSuffix}', '-', ''), 44)
var servicePlanName = take(toLower('${sanitizedPrefix}-plan-${environment}-${uniqueSuffix}'), 60)

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: servicePlanName
  location: location
  sku: {
    name: appServicePlanSkuName
    tier: appServicePlanSkuTier
    size: appServicePlanSkuName
    capacity: appServicePlanCapacity
  }
  properties: {
    reserved: true
    perSiteScaling: false
  }
}

resource backendWebApp 'Microsoft.Web/sites@2022-09-01' = {
  name: backendWebAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'NODE_ENV'
          value: environment
        }
        {
          name: 'MONGO_CONNECTION_STRING'
          value: listConnectionStrings(cosmosAccount.id, '2023-04-15').connectionStrings[0].connectionString
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
      ]
    }
  }
  dependsOn: [
    cosmosAccount
  ]
}

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
  }
}

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    defaultIdentity: 'FirstPartyIdentity'
    enableAutomaticFailover: true
    enableFreeTier: false
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    apiProperties: {
      serverVersion: '4.2'
    }
    ipRules: empty(allowedIpRange) ? [] : [
      {
        ipAddressOrRange: allowedIpRange
      }
    ]
    publicNetworkAccess: 'Enabled'
  }
}

resource cosmosMongoDatabase 'Microsoft.DocumentDB/databaseAccounts/apis/databases@2023-04-15' = {
  name: '${cosmosAccount.name}/mongodb/${cosmosDatabaseName}'
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
    options: {
      throughput: 400
    }
  }
  dependsOn: [
    cosmosAccount
  ]
}

output backendWebAppResourceId string = backendWebApp.id
output backendWebAppHostName string = backendWebApp.properties.defaultHostName
output staticWebAppResourceId string = staticWebApp.id
output staticWebAppDefaultHostName string = staticWebApp.properties.defaultHostname
output cosmosAccountResourceId string = cosmosAccount.id
output cosmosConnectionString string = listConnectionStrings(cosmosAccount.id, '2023-04-15').connectionStrings[0].connectionString
