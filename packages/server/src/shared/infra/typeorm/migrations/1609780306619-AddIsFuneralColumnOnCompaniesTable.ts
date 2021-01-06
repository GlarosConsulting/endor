import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsFuneralColumnOnCompaniesTable1609780306619
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'isFuneral',
        type: 'boolean',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('comapanies', 'isFuneral');
  }
}
