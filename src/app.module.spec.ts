import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Task))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });

  it('should provide TasksService', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Task))
      .useValue({})
      .compile();

    const tasksService = module.get<TasksService>(TasksService);
    expect(tasksService).toBeDefined();
  });

  it('should provide TasksController', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Task))
      .useValue({})
      .compile();

    const tasksController = module.get<TasksController>(TasksController);
    expect(tasksController).toBeDefined();
  });

  it('should provide ConfigService', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Task))
      .useValue({})
      .compile();

    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
  });

  it('should provide HealthController', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Task))
      .useValue({})
      .compile();

    const healthController = module.get<HealthController>(HealthController);
    expect(healthController).toBeDefined();
  });
});
