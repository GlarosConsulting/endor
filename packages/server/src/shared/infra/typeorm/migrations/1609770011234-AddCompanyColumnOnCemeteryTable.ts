import {
  TableColumn,
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyColumnOnCemeteryTable1609770011234
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cemeteries',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'cemeteries',
      new TableForeignKey({
        name: 'CompanyCemetery',
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        columnNames: ['company_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cemeteries', 'company_id');

    await queryRunner.dropForeignKey('cemeteries', 'CompanyCemetery');
  }
}
