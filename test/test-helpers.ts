import { TaskStatus, Task } from '../src/entities/task.entity';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../src/tasks/dto/update-task.dto';

/**
 * Helper functions to create test data for tasks tests
 */
export class TestHelpers {
  /**
   * Returns a valid-looking UUID that can be used as a non-existent task ID
   * @returns A UUID string that doesn't exist in the database
   */
  static getNonExistentTaskId(): string {
    return '00000000-0000-4000-a000-000000000000';
  }

  /**
   * Create a mock Task entity for testing
   * @param overrides Properties to override in the default task
   * @returns A mock Task entity
   */
  static createMockTask(overrides: Partial<Task> = {}): Task {
    return {
      id: 'test-task-id',
      title: 'Test Task',
      description: 'This is a test task description',
      status: TaskStatus.TO_DO,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Create multiple mock Task entities for testing
   * @param count Number of tasks to create
   * @returns An array of mock Task entities
   */
  static createMockTasks(count: number): Task[] {
    return Array(count)
      .fill(0)
      .map((_, index) => this.createMockTask({
        id: `test-task-id-${index}`,
        title: `Test Task ${index}`,
        status: index % 3 === 0 ? TaskStatus.TO_DO : 
                index % 3 === 1 ? TaskStatus.IN_PROGRESS : TaskStatus.DONE
      }));
  }

  /**
   * Create a mock CreateTaskDto for testing
   * @param overrides Properties to override in the default DTO
   * @returns A mock CreateTaskDto
   */
  static createTaskDto(overrides: Partial<CreateTaskDto> = {}): CreateTaskDto {
    return {
      title: 'New Test Task',
      description: 'This is a new test task',
      status: TaskStatus.TO_DO,
      ...overrides,
    };
  }

  /**
   * Create a mock UpdateTaskDto for testing
   * @param overrides Properties to override in the default DTO
   * @returns A mock UpdateTaskDto
   */
  static updateTaskDto(overrides: Partial<UpdateTaskDto> = {}): UpdateTaskDto {
    return {
      title: 'Updated Test Task',
      description: 'This task has been updated',
      status: TaskStatus.IN_PROGRESS,
      ...overrides,
    };
  }
}
