import zterrorlog from '../models/mongodb/zterrorlog.js';
import { getAISolution } from "../services/ai-service.js";





const GetAllErrors = async () => {
  try {
    const errors = await zterrorlog.find().lean();
    return JSON.stringify({
      status: 200,
      results: errors.length,
      data: errors,
    });
  } catch (error) {
    throw Error(300, error);
  }
};

const GetOneError = async (id) => {
  try {
    const error = await zterrorlog.findOne({ _id: id });
    if (error) {
      return JSON.stringify({
        status: 200,
        data: error,
      });
    }
    const notFoundError = new Error(`Error with ID ${id} not found`);
    notFoundError.code = 404;
    throw notFoundError;
  } catch (error) {
    throw error;
  }
};

const InsertOneError = async (error) => {
  try {
    const newError = await zterrorlog.create(error);
    return JSON.stringify({
      status: 201,
      message: 'Error inserted sucessfully',
      data: newError,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const UpdateOneError = async (error) => {
  const { _id } = error;
  try {
    const editedError = await zterrorlog.findOneAndUpdate({ _id }, error);
    if (editedError) {
      return JSON.stringify({
        status: 200,
        message: 'Error updated sucessfully',
        data: editedError,
      });
    }
    const notFoundError = new Error(`Error with ID ${_id} not found`);
    notFoundError.code = 404;
    throw notFoundError;
  } catch (error) {
    throw error;
  }
};

const DeleteOneError = async (id) => {
  try {
    const deletedError = await zterrorlog.findOneAndDelete(id);
    if (deletedError) {
      return JSON.stringify({
        status: 200,
        message: 'Error deleted sucessfully',
        data: deletedError,
      });
    }
    const notFoundError = new Error(`Error with ID ${id} not found`);
    notFoundError.code = 404;
    throw notFoundError;
  } catch (error) {
    throw error
  }
};

export default {
  GetAllErrors,
  GetOneError,
  InsertOneError,
  UpdateOneError,
  DeleteOneError,
};
