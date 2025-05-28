import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

@Entity()
export class Task {
  @ApiProperty({
    description: 'The unique identifier for the task',
    example: 'e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement task management API',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiPropertyOptional({
    description: 'The detailed description of the task',
    example: 'Create CRUD endpoints for tasks with proper validation',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
    example: TaskStatus.TO_DO,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'The timestamp when the task was created',
    example: '2025-05-26T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the task was last updated',
    example: '2025-05-26T13:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
