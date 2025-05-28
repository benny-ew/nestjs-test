import { IsOptional, IsString, IsEnum, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../../entities/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'The updated title of the task',
    example: 'Updated task title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  @IsNotEmpty({ message: 'If provided, title cannot be empty' })
  title?: string;

  @ApiPropertyOptional({
    description: 'The updated description of the task',
    example: 'Updated task description with more details',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'The updated status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    enumName: 'TaskStatus',
  })
  @IsOptional()
  @IsEnum(TaskStatus, { 
    message: `Status must be one of the following values: ${Object.values(TaskStatus).join(', ')}` 
  })
  status?: TaskStatus;
}
