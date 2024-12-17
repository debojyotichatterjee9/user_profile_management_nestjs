import { Expose } from 'class-transformer';

export class CreateOrganizationResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
