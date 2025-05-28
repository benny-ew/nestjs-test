import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement task management API',
    maxLength: 255,
    required: true,
  })
  @IsNotEmpty({ message: 'Title is required and cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  title: string;

  @ApiPropertyOptional({
    description: 'The detailed description of the task',
    example: 'Create CRUD endpoints for tasks with proper validation',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the task',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
    example: TaskStatus.TO_DO,
    enumName: 'TaskStatus',
  })
  @IsOptional()
  @IsEnum(TaskStatus, { 
    message: `Status must be one of the following values: ${Object.values(TaskStatus).join(', ')}` 
  })
  status?: TaskStatus = TaskStatus.TO_DO;
}
