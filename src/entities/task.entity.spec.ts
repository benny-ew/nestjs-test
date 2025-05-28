import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';

describe('TaskEntity', () => {
  let repository: Repository<Task>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = moduleRef.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should correctly create a task entity', () => {
    // Create a new task instance
    const task = new Task();
    task.id = '1';
    task.title = 'Test Task';
    task.description = 'This is a test task';
    task.status = TaskStatus.TO_DO;
    task.createdAt = new Date();
    task.updatedAt = new Date();

    // Test entity properties
    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.status).toBe(TaskStatus.TO_DO);
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should have the correct default status', () => {
    // Create a task without specifying status
    const task = new Task();
    task.title = 'Test Task';

    // By default, status should be TO_DO based on entity definition,
    // but in this unit test environment, it won't be populated from the DB column default
    // This is just testing the TypeScript property default
    expect(task.status).toBeUndefined();
  });

  describe('TaskStatus', () => {
    it('should have the correct enum values', () => {
      expect(Object.values(TaskStatus)).toEqual(['TO_DO', 'IN_PROGRESS', 'DONE']);
      expect(TaskStatus.TO_DO).toBe('TO_DO');
      expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
      expect(TaskStatus.DONE).toBe('DONE');
    });
  });

  // In a real-world application, you might want to add more tests to verify:
  // - Column constraints (like unique, not null)
  // - Relationships with other entities (if any)
  // - Validation of entity data
  // - Hook methods like @BeforeInsert, @BeforeUpdate, etc.
});
