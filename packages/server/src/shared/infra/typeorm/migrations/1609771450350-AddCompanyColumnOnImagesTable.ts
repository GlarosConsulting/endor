import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyColumnOnImagesTable1609771450350
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'images',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'images',
      new TableForeignKey({
        name: 'CompanyImage',
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        columnNames: ['company_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('images', 'company_id');

    await queryRunner.dropForeignKey('images', 'CompanyImage');
  }
}
