import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfolioFollowerAndVisitsTables1645382312844 implements MigrationInterface {
  name = 'CreatePortfolioFollowerAndVisitsTables1645382312844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portfolio_visit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "portfolio_id" uuid NOT NULL, "user_account_id" uuid, "visit_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_4673c944b252bb886846037160f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio_follower" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_account_id" uuid NOT NULL, "portfolio_id" uuid NOT NULL, "date_followed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_5d6e765205f91b4e12a8d777604" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1aeeb366674ec212f3870b9a25" ON "portfolio_follower" ("portfolio_id", "user_account_id") `
    );
    await queryRunner.query(`ALTER TABLE "portfolio_rating" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "stock_rating" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "stock_follower" ALTER COLUMN "date_followed" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "stock_visit" ALTER COLUMN "visit_date" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "date_joined" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_login" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "portfolio_visit" ADD CONSTRAINT "FK_2cded0dd1f363070c54c7979c19" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_visit" ADD CONSTRAINT "FK_006efb2db0d7efdfa9f78e16a82" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_follower" ADD CONSTRAINT "FK_cb82b1dc706668318d628cdc0c4" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_follower" ADD CONSTRAINT "FK_37150513d6b548a458576eae337" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolio_follower" DROP CONSTRAINT "FK_37150513d6b548a458576eae337"`);
    await queryRunner.query(`ALTER TABLE "portfolio_follower" DROP CONSTRAINT "FK_cb82b1dc706668318d628cdc0c4"`);
    await queryRunner.query(`ALTER TABLE "portfolio_visit" DROP CONSTRAINT "FK_006efb2db0d7efdfa9f78e16a82"`);
    await queryRunner.query(`ALTER TABLE "portfolio_visit" DROP CONSTRAINT "FK_2cded0dd1f363070c54c7979c19"`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "last_updated" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "date_created" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_login" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "date_joined" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "stock_visit" ALTER COLUMN "visit_date" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "stock_follower" ALTER COLUMN "date_followed" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "stock_rating" ALTER COLUMN "last_updated" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "portfolio_rating" ALTER COLUMN "last_updated" SET DEFAULT now()`);
    await queryRunner.query(`DROP INDEX "IDX_1aeeb366674ec212f3870b9a25"`);
    await queryRunner.query(`DROP TABLE "portfolio_follower"`);
    await queryRunner.query(`DROP TABLE "portfolio_visit"`);
  }
}
