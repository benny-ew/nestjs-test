import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from '../entities/task.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

// Mock implementation of QueryBuilder
const createQueryBuilderMock = {
  andWhere: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(0),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  // Mock data
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TO_DO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasks: Task[] = [
    mockTask,
    {
      id: '2',
      title: 'Another Task',
      description: 'Another Description',
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn().mockResolvedValue(mockTasks),
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks and pagination data', async () => {
      // Setup mocks
      const mockFilterDto: FindTaskDto = { page: 1, limit: 10 };
      const mockTotal = 2;
      createQueryBuilderMock.getCount.mockResolvedValueOnce(mockTotal);
      createQueryBuilderMock.getMany.mockResolvedValueOnce(mockTasks);

      // Execute
      const result = await service.findAll(mockFilterDto);

      // Assert
      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toEqual(mockTotal);
      expect(result.page).toEqual(1);
      expect(result.limit).toEqual(10);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('task');
    });

    it('should apply filters when provided', async () => {
      // Setup mocks
      const mockFilterDto: FindTaskDto = {
        status: TaskStatus.TO_DO,
        title: 'test',
        description: 'desc',
        page: 1,
        limit: 10,
      };
      createQueryBuilderMock.getCount.mockResolvedValueOnce(1);
      createQueryBuilderMock.getMany.mockResolvedValueOnce([mockTask]);

      // Execute
      await service.findAll(mockFilterDto);

      // Assert
      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith('task.status = :status', { status: TaskStatus.TO_DO });
      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
        'LOWER(task.title) LIKE LOWER(:title)',
        { title: '%test%' }
      );
      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
        'LOWER(task.description) LIKE LOWER(:description)',
        { description: '%desc%' }
      );
    });

    it('should handle errors during findAll', async () => {
      // Setup mocks
      createQueryBuilderMock.getCount.mockRejectedValueOnce(new Error('Database error'));

      // Execute and assert
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a task when it exists', async () => {
      // Setup mock
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockTask);

      // Execute
      const result = await service.findOne('1');

      // Assert
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw a NotFoundException when task does not exist', async () => {
      // Setup mock
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      // Execute and assert
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      // Setup mocks
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TO_DO,
      };
      const newTask = { ...mockTask, ...createTaskDto };
      jest.spyOn(repository, 'create').mockReturnValueOnce(newTask as Task);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(newTask as Task);

      // Execute
      const result = await service.create(createTaskDto);

      // Assert
      expect(result).toEqual(newTask);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalledWith(newTask);
    });

    it('should handle errors during task creation', async () => {
      // Setup mocks
      const createTaskDto: CreateTaskDto = { title: 'New Task', description: 'New Description' };
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error('Database error'));

      // Execute and assert
      await expect(service.create(createTaskDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      // Setup mocks
      const updateTaskDto: UpdateTaskDto = { status: TaskStatus.DONE };
      const updatedTask = { ...mockTask, ...updateTaskDto };
      
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockTask);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedTask as Task);

      // Execute
      const result = await service.update('1', updateTaskDto);

      // Assert
      expect(result).toEqual(updatedTask);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should propagate NotFoundException when task does not exist', async () => {
      // Setup mocks
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

      // Execute and assert
      await expect(service.update('999', { status: TaskStatus.DONE })).rejects.toThrow(NotFoundException);
    });

    it('should handle other errors during update', async () => {
      // Setup mocks
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockTask);
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error('Database error'));

      // Execute and assert
      await expect(service.update('1', { status: TaskStatus.DONE })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove the task when it exists', async () => {
      // Setup mock
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 1, raw: {} });

      // Execute
      await service.remove('1');

      // Assert
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when task to remove does not exist', async () => {
      // Setup mock
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 0, raw: {} });

      // Execute and assert
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
