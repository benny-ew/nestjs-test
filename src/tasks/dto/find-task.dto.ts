import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from '../../entities/task.entity';

export class FindTaskDto {
  @ApiPropertyOptional({
    description: 'Filter tasks by status',
    enum: TaskStatus,
    example: TaskStatus.TO_DO,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Search for tasks with titles containing this term',
    example: 'project',
    type: String,
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Search for tasks with descriptions containing this term',
    example: 'implement',
    type: String,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value || 1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value || 10)
  limit?: number = 10;
}
