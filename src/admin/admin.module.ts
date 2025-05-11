import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RandomDataProvider } from 'src/utilProviders/randomData.util.provider';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserTasksService } from './scheduledTasks/user.task.service';
import { OrganizationTasksService } from './scheduledTasks/organization.task.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { RolesController } from './controllers/admin.role.controller';
import { PermissionsController } from './controllers/admin.permission.controller';
import { PermissionsService } from './services/admin.permission.service';
import { RolesService } from './services/admin.role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    UserModule,
    OrganizationModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [AdminController, RolesController, PermissionsController],
  providers: [
    AdminService,
    UserTasksService,
    OrganizationTasksService,
    RandomDataProvider,
    RolesService,
    PermissionsService,
  ],
  exports: [RandomDataProvider],
})
export class AdminModule {}
