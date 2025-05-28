import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(filterDto?: FindTaskDto): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    try {
      const { status, title, description, page = 1, limit = 10 } = filterDto || {};
      
      const query = this.taskRepository.createQueryBuilder('task');
      
      // Apply status filter if provided
      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      
      // Apply title search if provided
      if (title) {
        query.andWhere('LOWER(task.title) LIKE LOWER(:title)', { title: `%${title}%` });
      }
      
      // Apply description search if provided
      if (description) {
        query.andWhere('LOWER(task.description) LIKE LOWER(:description)', { description: `%${description}%` });
      }
      
      // Get total count for pagination metadata
      const total = await query.getCount();
      
      // Apply pagination
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
      
      // Execute query
      const tasks = await query.getMany();
      
      return {
        tasks,
        total,
        page,
        limit
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch tasks: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(createTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      // Handle specific database errors if needed
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      const updatedTask = Object.assign(task, updateTaskDto);
      return await this.taskRepository.save(updatedTask);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
