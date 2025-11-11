# Despliegue en Azure y Azure DevOps

Este repositorio incluye los artefactos necesarios para desplegar la aplicación de gestión de errores en Azure utilizando Azure App Service, Azure Static Web Apps y Azure Cosmos DB (API para MongoDB). Además, se proporciona un pipeline multi-stage de Azure DevOps que automatiza la compilación y la entrega continua del backend y el frontend.

## Arquitectura objetivo

- **Backend (CAP/Express)** desplegado en un **Azure App Service** Linux con Node.js 20 LTS.
- **Base de datos** en **Azure Cosmos DB** con compatibilidad MongoDB, que expone la cadena de conexión como _application setting_.
- **Frontend (React)** publicado en **Azure Static Web Apps**.
- **Azure DevOps Pipeline** que construye los artefactos de cada componente y los entrega a los servicios anteriores.

La infraestructura base se aprovisiona mediante la plantilla [`infra/azure/main.bicep`](../../infra/azure/main.bicep) y su archivo de parámetros asociado [`infra/azure/main.parameters.json`](../../infra/azure/main.parameters.json).

## Aprovisionamiento de infraestructura

1. Inicia sesión en Azure e instala el CLI de Bicep si aún no lo tienes.
   ```bash
   az login
   az account set --subscription <SUBSCRIPTION_ID>
   az bicep install
   ```
2. Crea un grupo de recursos.
   ```bash
   az group create \
     --name rg-api-errores-dev \
     --location eastus
   ```
3. Implementa la plantilla principal (puedes ajustar los parámetros desde el archivo `.parameters.json` o usando `--parameters`).
   ```bash
   az deployment group create \
     --resource-group rg-api-errores-dev \
     --template-file infra/azure/main.bicep \
     --parameters @infra/azure/main.parameters.json
   ```

La salida del despliegue incluye:

- Nombre y _hostname_ del App Service del backend.
- Nombre del recurso de Static Web App.
- Cadena de conexión de Cosmos DB (`cosmosConnectionString`) que debe configurarse como secreto en Azure DevOps para la aplicación backend (`MONGO_CONNECTION_STRING`).

## Configuración del pipeline en Azure DevOps

1. Importa el repositorio en tu proyecto de Azure DevOps.
2. Crea un **Service connection** (tipo _Azure Resource Manager_ / _Service principal (automatic)_) con permisos sobre el grupo de recursos creado. Asigna el nombre y guárdalo (por ejemplo `sc-api-errores`).
3. Registra los siguientes secretos/variables en la biblioteca del proyecto o directamente en el pipeline:

   | Variable                         | Descripción                                                                                              |
   |----------------------------------|----------------------------------------------------------------------------------------------------------|
   | `AzureServiceConnection`         | Nombre de la _service connection_ creada en el paso anterior.                                            |
   | `BackendWebAppName`              | Nombre exacto del Web App creado por Bicep (salida `backendWebAppResourceId`, último segmento del ID).   |
   | `FrontendStaticWebAppName`       | Nombre de la Static Web App (salida `staticWebAppResourceId`).                                          |
   | `BackendResourceGroup`           | Grupo de recursos donde se aprovisionó el App Service del backend.                                       |
   | `FrontendResourceGroup`          | Grupo de recursos donde reside la Static Web App (por ejemplo `rg-api-errores-dev`).                     |
   | `StaticWebAppDeploymentToken`    | Token de despliegue de Static Web Apps (`az staticwebapp secrets list`).                                 |
   | `MONGO_CONNECTION_STRING`        | Cadena de conexión a Cosmos DB (salida `cosmosConnectionString`); se inyecta como configuración del backend. |

4. Si el backend requiere variables adicionales (por ejemplo `NODE_ENV`), agrégalas como _Application Settings_ en Azure App Service o como variables protegidas del pipeline.
5. Crea un nuevo pipeline en Azure DevOps seleccionando la opción **Existing Azure Pipelines YAML file** y apunta a [`azure-pipelines.yml`](../../azure-pipelines.yml).
6. Guarda y ejecuta el pipeline. El flujo realizará:

   - Restauración de dependencias y empaquetado del backend.
   - Construcción del bundle del frontend (ahora con el script `npm run build`).
   - Despliegue del backend al Azure Web App mediante `AzureWebApp@1`.
   - Carga de los archivos estáticos del frontend a Azure Static Web Apps mediante `az staticwebapp upload`.
   - Refresco de la variable de entorno `MONGO_CONNECTION_STRING` en el App Service del backend antes de publicar el paquete.

## Operación y mantenimiento

- Para rotar el token de Static Web Apps ejecuta: `az staticwebapp secrets reset --name <STATIC_WEB_APP> --resource-group <RG>` y actualiza la variable `StaticWebAppDeploymentToken`.
- Si necesitas escalar el App Service, modifica `appServicePlanSku` y `appServicePlanCapacity` en el archivo de parámetros y reprovisiona la plantilla.
- Las conexiones a Cosmos DB se controlan con `allowedIpRange`. Establécelo a una red específica para endurecer el acceso.
- El pipeline utiliza Node.js 20 LTS. Ajusta `nodeVersion` si la aplicación requiere otra versión.

Con estos elementos la aplicación queda lista para un ciclo completo de integración y despliegue continuo sobre Azure y Azure DevOps.
