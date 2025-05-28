import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Task, TaskStatus } from '../src/entities/task.entity';
import { TestHelpers } from './test-helpers';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;
  let dataSource: DataSource;

  // Test task for seeding and validation
  const testTask = TestHelpers.createTaskDto({
    title: 'E2E Test Task',
    description: 'Integration testing for the tasks API',
    status: TaskStatus.TO_DO
  });

  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Add validation pipes to ensure that the e2e test environment matches the real application
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
    dataSource = moduleFixture.get<DataSource>(DataSource);
    
    await app.init();
  });

  // Clean up all tasks before starting tests
  beforeEach(async () => {
    // Clear the tasks table before each test
    await taskRepository.clear();
  });

  afterAll(async () => {
    await dataSource.destroy(); // Close the database connection explicitly
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a task and return 201', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send(testTask)
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(testTask.title);
          expect(res.body.description).toBe(testTask.description);
          expect(res.body.status).toBe(testTask.status);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          
          // Save the ID for later tests
          createdTaskId = res.body.id;
        });
    });

    it('should return 400 when creating a task with invalid data', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ 
          // Missing title
          description: 'Invalid task',
          status: 'INVALID_STATUS' // Invalid status
        })
        .expect(400);
    });
  });

  describe('GET /tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        { title: 'Task 1', description: 'Description 1', status: TaskStatus.TO_DO },
        { title: 'Task 2', description: 'Description 2', status: TaskStatus.IN_PROGRESS },
        { title: 'Task 3', description: 'Description 3', status: TaskStatus.DONE }
      ];

      await Promise.all(tasks.map(task => taskRepository.save(taskRepository.create(task))));
    });

    it('should return all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body.tasks.length).toBe(3);
          expect(res.body).toHaveProperty('total', 3);
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('limit', 10);
        });
    });

    it('should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=DONE')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body.tasks.length).toBe(1);
          expect(res.body.tasks[0].status).toBe(TaskStatus.DONE);
        });
    });

    it('should filter tasks by title', () => {
      return request(app.getHttpServer())
        .get('/tasks?title=Task 1')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body.tasks.length).toBe(1);
          expect(res.body.tasks[0].title).toBe('Task 1');
        });
    });

    it('should paginate results', () => {
      return request(app.getHttpServer())
        .get('/tasks?page=1&limit=2')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body.tasks.length).toBe(2);
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('limit', 2);
          expect(res.body).toHaveProperty('total', 3);
        });
    });
  });

  describe('GET /tasks/:id', () => {
    let task: Task;

    beforeEach(async () => {
      // Create a test task
      task = await taskRepository.save(
        taskRepository.create({
          title: 'Get Single Task',
          description: 'Test retrieving a single task',
          status: TaskStatus.TO_DO
        })
      );
    });

    it('should return a task by ID', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', task.id);
          expect(res.body.title).toBe(task.title);
        });
    });

    it('should return 404 for non-existent task ID', () => {
      // Using the helper to get a non-existent ID
      const nonExistentId = TestHelpers.getNonExistentTaskId();
      
      return request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .expect(404)
        .expect(res => {
          // Verify the response includes an error message about not finding the task
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('PUT /tasks/:id', () => {
    let task: Task;

    beforeEach(async () => {
      // Create a test task
      task = await taskRepository.save(
        taskRepository.create({
          title: 'Task to Update',
          description: 'This task will be updated',
          status: TaskStatus.TO_DO
        })
      );
    });

    it('should update a task', () => {
      const updatedData = {
        title: 'Updated Task',
        description: 'This task has been updated',
        status: TaskStatus.DONE
      };

      return request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send(updatedData)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', task.id);
          expect(res.body.title).toBe(updatedData.title);
          expect(res.body.description).toBe(updatedData.description);
          expect(res.body.status).toBe(updatedData.status);
        });
    });

    it('should return 404 when updating non-existent task', () => {
      // Using the helper to get a non-existent ID
      const nonExistentId = TestHelpers.getNonExistentTaskId();
      
      return request(app.getHttpServer())
        .put(`/tasks/${nonExistentId}`)
        .send({
          title: 'Updated Task',
          status: TaskStatus.DONE
        })
        .expect(404)
        .expect(res => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('PATCH /tasks/:id', () => {
    let task: Task;

    beforeEach(async () => {
      // Create a test task
      task = await taskRepository.save(
        taskRepository.create({
          title: 'Task to Patch',
          description: 'This task will be patched',
          status: TaskStatus.TO_DO
        })
      );
    });

    it('should partially update a task', () => {
      // Only update status
      const patchData = {
        status: TaskStatus.IN_PROGRESS
      };

      return request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send(patchData)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', task.id);
          expect(res.body.status).toBe(patchData.status); // Should be updated
        });
    });

    it('should return 404 when patching non-existent task', () => {
      // Using the helper to get a non-existent ID
      const nonExistentId = TestHelpers.getNonExistentTaskId();
      
      return request(app.getHttpServer())
        .patch(`/tasks/${nonExistentId}`)
        .send({
          status: TaskStatus.DONE
        })
        .expect(404)
        .expect(res => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('DELETE /tasks/:id', () => {
    let task: Task;

    beforeEach(async () => {
      // Create a test task
      task = await taskRepository.save(
        taskRepository.create({
          title: 'Task to Delete',
          description: 'This task will be deleted',
          status: TaskStatus.TO_DO
        })
      );
    });

    it('should delete a task and return 204', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(204)
        .then(() => {
          // Verify the task is deleted
          return request(app.getHttpServer())
            .get(`/tasks/${task.id}`)
            .expect(404);
        });
    });

    it('should return 404 when deleting non-existent task', () => {
      // Using the helper to get a non-existent ID
      const nonExistentId = TestHelpers.getNonExistentTaskId();
      
      return request(app.getHttpServer())
        .delete(`/tasks/${nonExistentId}`)
        .expect(404)
        .expect(res => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('not found');
        });
    });
  });
});
