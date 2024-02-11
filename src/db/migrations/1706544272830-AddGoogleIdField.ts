import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGoogleIdField1706544272830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: "googleId",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user", "googleId");
  }
}
