import mongoose from 'mongoose';

const zterrorlogSchema = new mongoose.Schema(
  {
    ERRORMESSAGE: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    ERRORDATETIME: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ERRORCODE: {
      type: String,
      required: true,
      maxlength: 500,
    },
    ERRORSOURCE: {
      type: String,
      required: true,
      maxlength: 500,
    },
    AI_REQUESTED: {
      type: Boolean,
      default: false,
    },
    AI_RESPONSE: {
      type: String,
      maxlength: 5000,
      default: null,
    },
    STATUS: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'RESOLVED', 'IGNORED'],
      default: 'NEW',
    },
    CONTEXT: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    SEVERITY: {
      type: String,
      enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
    },
    MODULE: {
      type: String,
      required: true,
    },
    APPLICATION: {
      type: String,
      required: true,
    },
    USER: {
      type: String,
      default: null,
    },
    //Pagina de la app donde surgió el error
    // En que proceso ucurrió
  },
  { collection: 'ZTERRORLOG' }
);

export default mongoose.model('ZTERRORLOG', zterrorlogSchema);
