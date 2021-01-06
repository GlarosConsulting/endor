import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateIsUiqueForNameColumnOnImagesTable1609875780176
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'images',
      'name',
      new TableColumn({
        name: 'name',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('images', 'name');
  }
}
