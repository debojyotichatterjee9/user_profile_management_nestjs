import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import loggernaut from 'loggernaut';
import { V3 } from 'paseto';


interface PasetoPayload {
  [key: PropertyKey]: unknown;
}

@Injectable()
export class PasetoProvider {
  constructor(private configService: ConfigService) {}

  async generatePaserkLocalKey(): Promise<string> {
    try {
      return await V3.generateKey('local', {
        format: 'paserk',
      });    
    } catch (error) {
      loggernaut.error(error.message);
      throw new Error('Failed to generate PASETO local key.');
    }
  }

  async generateEncryptedToken(payload: PasetoPayload, PASETO_LOCAL_KEY:string) {
    try {
      console.log('>> ################################################## <<');
      console.log(this.configService.get('PASETO.audience'))
      console.log(this.configService.get('PASETO.issuer'))
      return await V3.encrypt(payload, PASETO_LOCAL_KEY, {
        audience: this.configService.get('PASETO.audience'),
        issuer: this.configService.get('PASETO.issuer'),
        expiresIn: '2 hours',
      });
    } catch (error) {
      loggernaut.error(error.message);
      throw new Error('Failed to generate encrypted token.');
    }
  }

  async decodeEncryptedToken(token: string, pasetoKey: string) {
    try {
      return await V3.decrypt(token, pasetoKey, {
        audience: 'urn:example:client',
        issuer: 'https://op.example.com',
        clockTolerance: '1 min'
      })
    } catch (error) {
      loggernaut.error(error.message);
      throw new Error('Failed to decode the encrypted token.')
    }
  }
}
