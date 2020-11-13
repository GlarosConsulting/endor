import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDeceased1604978822000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'deceased',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'responsible_id',
            type: 'uuid',
          },
          {
            name: 'funeral_initial_date',
            type: 'timestamp',
          },
          {
            name: 'funeral_final_date',
            type: 'timestamp',
          },
          {
            name: 'sepulting_date',
            type: 'timestamp',
          },
          {
            name: 'live_chat_link',
            type: 'varchar',
          },
          {
            name: 'funeral_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'ResponsibleCustomerDeceased',
            referencedTableName: 'customers',
            referencedColumnNames: ['id'],
            columnNames: ['responsible_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FuneralDeceased',
            referencedTableName: 'funerals',
            referencedColumnNames: ['id'],
            columnNames: ['funeral_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('funerals');
  }
}
