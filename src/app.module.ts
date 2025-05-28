import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Task } from './entities/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME') || 'nestjs_db',
        entities: [Task],
        autoLoadEntities: true,
        // Disable synchronize in production - use migrations instead
        synchronize: configService.get('NODE_ENV') !== 'production',
        // Add migration configuration for production
        migrationsRun: configService.get('NODE_ENV') === 'production',
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    TypeOrmModule.forFeature([Task]),
    TasksModule,
    TerminusModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
