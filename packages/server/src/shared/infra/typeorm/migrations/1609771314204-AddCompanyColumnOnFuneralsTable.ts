import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyColumnOnFuneralsTable1609771314204
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'funerals',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'funerals',
      new TableForeignKey({
        name: 'CompanyFuneral',
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        columnNames: ['company_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('funerals', 'company_id');

    await queryRunner.dropForeignKey('funerals', 'CompanyFuneral');
  }
}
