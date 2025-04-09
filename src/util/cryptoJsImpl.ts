import * as CryptoJS from 'crypto-js';
import { LoginService } from 'src/app/services/login.service';


export class CryptoJsImpl{


    static encryptData(data : any) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), LoginService.getToken.toString()).toString();
        } catch (e) {
            return ""
        }
    }

    static decryptData(data : any) {

        try {
            const bytes = CryptoJS.AES.decrypt(data, LoginService.getToken.toString());
        if (bytes.toString()) {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
        
        } catch (e) {
            console.log(e);
        }
    }
}