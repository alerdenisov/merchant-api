import { Module } from '@nestjs/common';
import { ManageController } from 'manage/manage.controller';
import { ManageService } from 'manage/manage.service';

@Module({
  controllers: [ManageController],
  providers: [ManageService],
})
export class ManageModule {}
