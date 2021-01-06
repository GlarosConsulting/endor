import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyColumnOnDeceasedTable1609770885596
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'deceased',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'deceased',
      new TableForeignKey({
        name: 'CompanyDeceased',
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        columnNames: ['company_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('deceased', 'company_id');

    await queryRunner.dropForeignKey('deceased', 'CompanyDeceased');
  }
}
