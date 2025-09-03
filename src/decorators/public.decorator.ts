import { SetMetadata } from '@nestjs/common';
import { PUBLIC_API_KEY } from '../config/generic.constants';

export const Public = () => SetMetadata(PUBLIC_API_KEY, true);
