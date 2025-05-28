import { MigrationInterface, QueryRunner } from "typeorm";
import { TaskStatus } from "../entities/task.entity";

export class SeedInitialTasks1716701835124 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert some initial demo tasks
        await queryRunner.query(`
            INSERT INTO "task" ("title", "description", "status")
            VALUES 
                ('Set up project', 'Initialize the NestJS project with proper dependencies', '${TaskStatus.DONE}'),
                ('Create tasks entity', 'Define the Task entity with appropriate fields', '${TaskStatus.DONE}'),
                ('Implement CRUD operations', 'Create controller and service methods for task management', '${TaskStatus.IN_PROGRESS}'),
                ('Set up validation', 'Implement request validation using class-validator', '${TaskStatus.TO_DO}'),
                ('Write tests', 'Implement unit and e2e tests for the task module', '${TaskStatus.TO_DO}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the seed data
        await queryRunner.query(`
            DELETE FROM "task" 
            WHERE "title" IN (
                'Set up project', 
                'Create tasks entity', 
                'Implement CRUD operations', 
                'Set up validation',
                'Write tests'
            );
        `);
    }
}
