import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TaskStatus } from "../entities/task.entity";

export class CreateTasksTable1716701835123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "task",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: Object.values(TaskStatus),
                        enumName: "task_status_enum",
                        default: `'${TaskStatus.TO_DO}'`,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create uuid-ossp extension for UUID generation if not exists
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("task");
        // You might want to drop the enum type as well
        await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum";`);
    }
}
