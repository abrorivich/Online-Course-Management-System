import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { User } from './user/entities/user.entity';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ResultsModule } from './results/results.module';
import { Course } from './course/entities/course.entity';
import { Modules } from './modules/entities/module.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { Assignment } from './assignments/entities/assignment.entity';
import { Result } from './results/entities/result.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: +process.env.DATABASE_PORT || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'avaz1514',
      database: process.env.POSTGRES_DB || 'exam',
      entities: [User, Course, Modules, Lesson, Assignment, Result],
      synchronize: true,
      autoLoadEntities: true
    }),
    UserModule,
    AuthModule,
    CourseModule,
    ModulesModule,
    LessonsModule,
    AssignmentsModule,
    ResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
