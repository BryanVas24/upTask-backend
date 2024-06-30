import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];
    //esto es para permitir que thunderclient haga solicitudes
    //el process .argv sale del json
    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
    }
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de cors"));
    }
  },
};
