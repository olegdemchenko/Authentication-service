import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFacebookIdField1706882906661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "facebookId",
        type: "varchar",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user", "googleId");
  }
}
