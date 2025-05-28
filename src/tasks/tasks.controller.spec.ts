import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  // Mock data
  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TO_DO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasks: Task[] = [
    mockTask,
    {
      id: '987f6543-d21b-45e7-b789-123456789012',
      title: 'Another Task',
      description: 'Another Description',
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockTasksResponse = {
    tasks: mockTasks,
    total: 2,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTasksResponse),
            findOne: jest.fn().mockResolvedValue(mockTask),
            create: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue(mockTask),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks with pagination data', async () => {
      const result = await controller.findAll(
        TaskStatus.TO_DO,
        'test',
        'description',
        1,
        10
      );
      
      expect(result).toEqual(mockTasksResponse);
      expect(service.findAll).toHaveBeenCalledWith({
        status: TaskStatus.TO_DO,
        title: 'test',
        description: 'description',
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const result = await controller.findOne('123e4567-e89b-12d3-a456-426614174000');
      
      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TO_DO,
      };
      
      const result = await controller.create(createTaskDto);
      
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.DONE,
      };
      
      const result = await controller.update('1', updateTaskDto);
      
      expect(result).toEqual(mockTask);
      expect(service.update).toHaveBeenCalledWith('1', updateTaskDto);
    });
  });

  describe('patch', () => {
    it('should partially update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };
      
      const result = await controller.patch('1', updateTaskDto);
      
      expect(result).toEqual(mockTask);
      expect(service.update).toHaveBeenCalledWith('1', updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
