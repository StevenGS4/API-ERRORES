import respPWA from './../../middlewares/respPWA.handler.js';
import { functionsDic } from '../../middlewares/queryDic.js';

const { OK, FAIL, BITACORA, DATA, AddMSG } = respPWA;

export const crudErrores = async (params, body) => {
  let bitacora = BITACORA();

  const { queryType, LoggedUser, dbServer } = params;

  if (!functionsDic[queryType]) {
    const err = new Error(`Unsupported queryType: ${queryType}`);
    err.statusCode = 402;

    bitacora.success = false;
    bitacora.status = err.statusCode;
    bitacora.messageUSR = err.message; // process: '';
    bitacora.messageDEV = err.message;
    bitacora.countData = 0;
    bitacora.dbServer = dbServer || 'not provided';

    bitacora.loggedUser = LoggedUser || 'not provided'; // server: '';
    bitacora.finalRes = true;
    return FAIL(bitacora);
  }
  const queryChecks = {
    LoggedUser,
    dbServer,
    queryType,
  };

  const noTypes = Object.entries(queryChecks)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (noTypes.length > 0) {
    bitacora.success = false;
    bitacora.status = 512;
    bitacora.messageUSR = `NO se encontraron los queries: ${noTypes.join(
      ', '
    )}`;
    bitacora.messageDEV = `NO se encontraron los queries: ${noTypes.join(
      ', '
    )}`;
    bitacora.countData = 0;
    bitacora.dbServer =
      dbServer || `NO se encontraron los queries: ${noTypes.join(', ')}`;
    bitacora.loggedUser = LoggedUser || 'not provided';
    bitacora.finalRes = true;

    return FAIL(bitacora);
  }

  bitacora = await functionsDic[queryType](params, bitacora, body);
  if (bitacora.success) {
    return OK(bitacora);
  }
  return FAIL(bitacora);
};
