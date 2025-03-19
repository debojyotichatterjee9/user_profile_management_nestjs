import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RandomDataProvider } from 'src/utilProviders/randomData.util.provider';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserTasksService } from './scheduledTasks/user.task.service';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService, UserTasksService, RandomDataProvider],
  exports: [RandomDataProvider],
})
export class AdminModule {}
