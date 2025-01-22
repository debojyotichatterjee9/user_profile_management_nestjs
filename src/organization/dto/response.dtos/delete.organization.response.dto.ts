import { Expose } from 'class-transformer';

export class DeleteOrganizationResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
