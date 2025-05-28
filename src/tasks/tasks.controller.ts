import { Controller, Get, Post, Body, Param, Put, Patch, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filtering and pagination' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false, description: 'Filter tasks by status' })
  @ApiQuery({ name: 'title', type: String, required: false, description: 'Search for tasks with titles containing this term' })
  @ApiQuery({ name: 'description', type: String, required: false, description: 'Search for tasks with descriptions containing this term' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retrieved tasks successfully', 
    schema: {
      properties: {
        tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
        total: { type: 'number', description: 'Total number of tasks matching the filter' },
        page: { type: 'number', description: 'Current page number' },
        limit: { type: 'number', description: 'Number of items per page' }
      }
    }
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('title') title?: string,
    @Query('description') description?: string,
    @Query('page', new ValidationPipe({ transform: true })) page: number = 1,
    @Query('limit', new ValidationPipe({ transform: true })) limit: number = 10,
  ): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const filterDto: FindTaskDto = { status, title, description, page, limit };
    return this.tasksService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the task', example: 'e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5' })
  @ApiResponse({ status: 200, description: 'Task found', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string): Promise<Task> {
    // Check if ID is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`Task with ID "${id}" not found - Invalid UUID format`);
    }
    
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input or validation failed' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace a task by ID (full update)' })
  @ApiParam({ name: 'id', description: 'The ID of the task', example: 'e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input or validation failed' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task partially by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the task', example: 'e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task partially updated successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input or validation failed' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  patch(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the task', example: 'e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
