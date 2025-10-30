namespace err.sch;

using {cuid, managed} from '@sap/cds/common'; //PERMITE AGREGAR UN UUID GENERADO AUTOMATICO

// ENUM PARA QUE SOLO SE PUEDAN INGRESAR LAS SIGUIENTES OPCIONES:
type Status   : String(20) enum {
    NEW;
    IN_PROGRESS;
    RESOLVED;
    IGNORED;
}
// ENUM PARA QUE SOLO SE PUEDAN INGRESAR LAS SIGUIENTES OPCIONES:
type Severity : String(10) enum {
    NEW;
    INFO;
    WARNING;
    ERROR;
    CRITICAL;
}

entity zterrorlog : cuid, managed { //DECIMOS A CAP QUE GENERARÁ UN UUID AUTOMÁTICO

    ERRORMESSAGE  : String(2000) not null;
    ERRORDATETIME : DateTime not null @cds.on.insert: $now;
    ERRORCODE     : String(500) not null;
    ERRORSOURCE   : String(500) not null;
    AI_REQUESTED  : Boolean default false;
    AI_RESPONSE   : String(5000);
    STATUS        : Status default 'NEW';
    CONTEXT       : LargeString;
    SEVERITY      : Severity;
    MODULE        : String not null;
    APPLICATION   : String not null;
    USER          : String;
}
