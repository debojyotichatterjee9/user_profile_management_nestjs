import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RandomDataProvider } from 'src/utilProviders/randomData.util.provider';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserTasksService } from './scheduledTasks/user.task.service';
import { OrganizationTasksService } from './scheduledTasks/organization.task.service';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [UserModule, OrganizationModule],
  controllers: [AdminController],
  providers: [AdminService, UserTasksService, OrganizationTasksService, RandomDataProvider],
  exports: [RandomDataProvider],
})
export class AdminModule {}
