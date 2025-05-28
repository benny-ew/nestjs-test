import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { FindTaskDto } from './find-task.dto';
import { TaskStatus } from '../../entities/task.entity';

describe('Task DTOs', () => {
  describe('CreateTaskDto', () => {
    it('should validate a valid create task DTO', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: 'Valid Task',
        description: 'A valid task description',
        status: TaskStatus.TO_DO
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with empty title', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: '',
        description: 'A valid task description',
        status: TaskStatus.TO_DO
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with invalid status', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: 'Valid Task',
        description: 'A valid task description',
        status: 'INVALID_STATUS'
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });
  });

  describe('UpdateTaskDto', () => {
    it('should validate a valid update task DTO', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        title: 'Updated Task',
        status: TaskStatus.DONE
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a partial update with only status', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        status: TaskStatus.DONE
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid status', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        status: 'INVALID_STATUS'
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });
  });

  describe('FindTaskDto', () => {
    it('should validate a valid find task DTO with all optional filters', async () => {
      const dto = plainToInstance(FindTaskDto, {
        status: TaskStatus.IN_PROGRESS,
        title: 'Search Term',
        description: 'Description Search',
        page: 2,
        limit: 20
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a find task DTO with no filters', async () => {
      const dto = plainToInstance(FindTaskDto, {});
      
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with negative page number', async () => {
      const dto = plainToInstance(FindTaskDto, {
        page: -1
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should fail validation with negative limit', async () => {
      const dto = plainToInstance(FindTaskDto, {
        limit: -10
      });
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });
  });
});
