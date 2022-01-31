import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateStockFollowerAndVisitsTables1640843121560 implements MigrationInterface {
    name = 'CreateStockFollowerAndVisitsTables1640843121560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_2399487992928fe4c59e56ab06f"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_414daa013658c3fc59acbace655"`);
        await queryRunner.query(`CREATE TABLE "stock_follower" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_account_id" uuid NOT NULL, "ticker" character varying NOT NULL, "date_followed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_688a2fa5baf3124b77ddc7204be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c1175fdea2520926a08ec7768a" ON "stock_follower" ("ticker", "user_account_id") `);
        await queryRunner.query(`CREATE TABLE "stock_visit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticker" character varying NOT NULL, "visit_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_account_id" uuid, CONSTRAINT "PK_8a08afb144e00d2ff235c6a91ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_rating" ALTER COLUMN "last_updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "date_joined" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_login" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" ALTER COLUMN "last_updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "date_created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "last_updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stock_follower" ADD CONSTRAINT "FK_ad9f9e405eecd6b3221ecded280" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_visit" ADD CONSTRAINT "FK_f14351577283747426935b1806e" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_2399487992928fe4c59e56ab06f" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_414daa013658c3fc59acbace655" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_414daa013658c3fc59acbace655"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_2399487992928fe4c59e56ab06f"`);
        await queryRunner.query(`ALTER TABLE "stock_visit" DROP CONSTRAINT "FK_f14351577283747426935b1806e"`);
        await queryRunner.query(`ALTER TABLE "stock_follower" DROP CONSTRAINT "FK_ad9f9e405eecd6b3221ecded280"`);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "last_login" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "date_joined" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "stock_rating" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "stock_visit"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1175fdea2520926a08ec7768a"`);
        await queryRunner.query(`DROP TABLE "stock_follower"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_414daa013658c3fc59acbace655" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_2399487992928fe4c59e56ab06f" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
