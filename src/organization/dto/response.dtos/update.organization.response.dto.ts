import { Expose } from 'class-transformer';

export class UpdateOrganizationResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
