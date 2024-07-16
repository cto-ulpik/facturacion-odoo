import {DateTime} from 'luxon';

/**
 * Diccionario con los valores necesarios para autenticar una transaccion
 * @typedef {Object} AuthDict
 * @property {string} login - Nombre de usuario
 * @property {string} nonce - Valor aleatorio de 16 caracteres
 * @property {string} seed - Fecha y hora en formato ISO
 * @property {string} trankey - Valor cri 
 */
export interface AuthDict {
    login: string;
    nonce: string;
    seed: string;
    trankey: string;
}

/**
 * Esta función se encarga de generar un diccionario con los valores necesarios para autenticar una transacción
 * @param login Nombre del Usuario (Correo Electronico)
 * @param secretKey Clave secreta del usuario (Brindada por GBC)
 * @returns Retornara un Diccionario con los valores necesarios para autenticar una transaccion
 */

export function getAuthDict(
    login:string , 
    secretKey:string): AuthDict {
    
        // Creacion de nonce y seed
    const nonceCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nonce = Array.from({ length: 16 })
        .map(() => nonceCharacters.charAt(Math.floor(Math.random() * nonceCharacters.length)))
        .join('');
    const nonceB64 = Buffer.from(nonce).toString('base64');
    const seed = DateTime.utc().toISO();
 
    // Creacion del trankeyut
    let combined = nonce + seed + secretKey;
    const trankeyBuffer = new Bun.CryptoHasher('sha256').update(combined).digest();
    const trankeyB64 = Buffer.from(trankeyBuffer).toString('base64');
 
    // Se retorna el diccionario con los valores
    return {
        login: login,
        nonce: nonceB64,
        seed: seed,
        trankey: trankeyB64
    };
 }

 