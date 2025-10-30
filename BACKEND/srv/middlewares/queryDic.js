import zterrorlogService from '../api/services/zterrorlog-service.js';
import { whatTypeVarIs } from '../helpers/variables.js';

const getAllFunction = async (params, bitacora) => {
  const { LoggedUser, dbServer } = params;

  try {
    let result = await zterrorlogService.GetAllErrors();
    result = JSON.parse(result); //PARSEAR RESULTADO A JSON

    //ASIGNAR LOS CAMPOS Y VALORES A BITACORA
    bitacora.data.push(result.data);
    bitacora.countData = result.results;
    bitacora.success = true;
    bitacora.status = 200;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;

    return bitacora;
  } catch (errorBita) {
    bitacora.countData = 0;
    bitacora.success = false;
    bitacora.status = 525;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;
    bitacora.messageDEV = errorBita.message;
    bitacora.messageUSR = 'Error al extraer los usuarios';
    return bitacora;
  }
};

const getOneFunction = async (params, bitacora) => {
  const { LoggedUser, dbServer, id } = params;

  try {
    if (!id) {
      throw { code: 400, msg: 'Debes de proporcionar un _id' };
    }

    let result = await zterrorlogService.GetOneError(id);
    result = JSON.parse(result); //PARSEAR RESULTADO A JSON

    //ASIGNAR LOS CAMPOS Y VALORES A BITACORA
    bitacora.data.push(result.data);
    bitacora.countData = result.results;
    bitacora.success = true;
    bitacora.status = 200;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;
    bitacora.messageUSR = 'Data succesfully recovered';
    bitacora.messageDEV = 'Data succesfully recovered';
    return bitacora;
  } catch (errorBita) {
    //ASIGNAR LOS CAMPOS Y VALORES A BITACORA error
    bitacora.countData = 0;
    bitacora.success = false;
    bitacora.status = errorBita.code;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;
    bitacora.messageDEV = errorBita.message;
    bitacora.messageUSR = 'Error al extraer el usuario';
    return bitacora;
  }
};

const addFunciton = async (params, bitacora, body) => {
  const { LoggedUser, dbServer, id } = params;
  const { data } = body;

  try {
    if (!data) {
      throw new Error('Missing data');
    }
    let result;
    if (whatTypeVarIs(body.data) === 'isArray') {
      const results = await Promise.all(
        body.data.map(async (error) => {
          const insertResult = await zterrorlogService.InsertOneError(error);
          return JSON.parse(insertResult).data;
        })
      );

      bitacora.data = results;
      bitacora.countData = results.length;
      bitacora.success = true;
      bitacora.status = 201;
      bitacora.loggedUser = LoggedUser;
      bitacora.finalRes = true;
      bitacora.dbServer = dbServer;
      bitacora.messageUSR = 'Errores insertados correctamente';
      bitacora.messageDEV = 'Errores insertados correctamente';

      return bitacora;
    }

    const error = body.data;
    result = await zterrorlogService.InsertOneError(error);
    result = JSON.parse(result);
    if (result) {
      //ASIGNAR LOS CAMPOS Y VALORES A BITACORA
      bitacora.data.push(error);
      bitacora.countData = 1;
      bitacora.success = true;
      bitacora.status = 201;
      bitacora.loggedUser = LoggedUser;
      bitacora.finalRes = true;
      bitacora.dbServer = dbServer;
      return bitacora;
    }
  } catch (errorBita) {
    bitacora.countData = 0;
    bitacora.success = false;
    bitacora.status = 525;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;
    bitacora.messageDEV = errorBita.message;
    bitacora.messageUSR = 'Error al insertar errores';
    return bitacora;
  }
};

const updateFunction = async (params, bitacora, body) => {
  console.log(params);
  const { LoggedUser, dbServer } = params;
  const { data } = body;
  try {
    if (!data) {
      throw new Error('Missing data');
    }

    let result;
    if (whatTypeVarIs(data) === 'isArray') {
      result = await Promise.all(
        data.map(async (error) => {
          const results = await zterrorlogService.UpdateOneError(error);
          return JSON.parse(results).data;
        })
      );

      if (result) {
        result = JSON.parse(result);
        //ASIGNAR LOS CAMPOS Y VALORES A BITACORA
        bitacora.data.push(result.data);
        bitacora.countData = result.length;
        bitacora.success = true;
        bitacora.status = 200;
        bitacora.loggedUser = LoggedUser;
        bitacora.finalRes = true;
        bitacora.dbServer = dbServer;
        bitacora.messageUSR = 'Errores actualizados correctamente';
        bitacora.messageDEV = 'Errores actualizados correctamente';
        return bitacora;
      }
    }

    const { _id } = data;

    if (!_id) {
      throw { code: 400, msg: 'Debes de proporcionar un _id' };
    }

    result = await zterrorlogService.UpdateOneError(data);
    result = JSON.parse(result);
    if (result) {
      //ASIGNAR LOS CAMPOS Y VALORES A BITACORA
      bitacora.data.push(result.data);
      bitacora.countData = 1;
      bitacora.success = true;
      bitacora.status = 200;
      bitacora.loggedUser = LoggedUser;
      bitacora.finalRes = true;
      bitacora.dbServer = dbServer;
      bitacora.messageUSR = 'Error actualizado correctamente';
      bitacora.messageDEV = 'Error actualizado correctamente';
      return bitacora;
    }
  } catch (error) {
    bitacora.countData = 1;
    bitacora.success = false;
    bitacora.status = error.code;
    bitacora.loggedUser = LoggedUser;
    bitacora.finalRes = true;
    bitacora.dbServer = dbServer;
    bitacora.messageUSR = 'Error no correctamente';
    bitacora.messageDEV = error;
    return bitacora;
  }
};

export const functionsDic = {
  getAll: (params, bitacora) => getAllFunction(params, bitacora),
  getOne: (params, bitacora) => getOneFunction(params, bitacora),
  add: (params, bitacora, body) => addFunciton(params, bitacora, body),
  update: (params, bitacora, body) => updateFunction(params, bitacora, body),
};
