import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import loggernaut from 'loggernaut';
import { V3 } from 'paseto';

interface PasetoPayload {
  [key: PropertyKey]: string;
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

  async generateEncryptedToken(
    payload: PasetoPayload,
    PASETO_LOCAL_KEY: string,
  ) {
    try {
      return await V3.encrypt(payload, PASETO_LOCAL_KEY, {
        assertion: this.configService.get('PASETO.audience'),
        audience: this.configService.get('PASETO.audience'),
        expiresIn: this.configService.get('PASETO.token_life'),
        iat: true,
        issuer: this.configService.get('PASETO.issuer'),
        // jti: "unique-token-id", // Replace with a generated UUID
        // kid: "key-id-1234", // Replace with a unique key identifier
        notBefore: this.configService.get('PASETO.not_before'),
        now: new Date(),
        subject: payload.user_id,
        footer: {
          purpose: this.configService.get('PASETO.purpose'),
        },
      });
    } catch (error) {
      loggernaut.error(error.message);
      throw new Error('Failed to generate encrypted token.');
    }
  }

  async decodeEncryptedToken(token: string, pasetoKey: string) {
    try {
      return await V3.decrypt(token, pasetoKey, {
        assertion: this.configService.get('PASETO.audience'),
        audience: this.configService.get('PASETO.audience'),
        issuer: this.configService.get('PASETO.issuer'),
        maxTokenAge: this.configService.get('PASETO.max_token_age'),
        clockTolerance: this.configService.get('PASETO.clock_tolerance'),
      });
    } catch (error) {
      loggernaut.error(error.message);
      throw new Error('Failed to decode the encrypted token.');
    }
  }
}
