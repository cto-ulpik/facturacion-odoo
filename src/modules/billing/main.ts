import { getAuthDict, type AuthDict } from "../auth/getAuth";
import { sendEmailWhenError } from "../email/templates/sendEmailWhenError";
import { sendEmailWhenBill } from "../email/templates/sendEmailWhenBill";
import getData from "../roots/roots.data";
import https from 'https';
      

export default function createBill(payload:any){
    /**
     * PROCEDIMIENTO PARA GENERAR LA FACTURA
     * 1. Se obtiene el login y la clave secreta de las variables de entorno (Registrada con una Fecha y Criptografiada con SHA256)
     */
    const login: string = process.env.GBC_USERNAME ?? ''; 
    const secretKey: string = process.env.GBC_SECRET_KEY ?? '';
    const auth: AuthDict = getAuthDict(login, secretKey);
    const data = getData(auth, payload);

    const postData = {
      auth: auth,
      data: data
    }

    let options = {
      'method': 'POST',
      'hostname': 'gbc.mivilsoft.com',
      'path': '/msapi/account_invoice',
      'headers': {
        'Content-Type': 'text/plain',
      },
      'maxRedirects': 20
    };
    
    let req:any = https.request(options, function (res) {
      var chunks:any = [];
    
      res.on("data", function (chunk:any) {
        chunks.push(chunk);
      });
    
      res.on("end", async function (chunk:any) {
        var body = Buffer.concat(chunks);

        if(body.toString().includes('errors')){
          await sendEmailWhenError(data);
          console.log(body.toString());
          return ''
        }

        console.log(body.toString());
        await sendEmailWhenBill(data);
        return '';
      });
      
      res.on("error", async function (error) {
        console.error(error);
        
      });
    });
  
    console.log('Se emite una factura +')
    req.write(JSON.stringify(postData));
    req.end();

    return;
}
