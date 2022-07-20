import {MigrationInterface, QueryRunner} from "typeorm";

export class StockPageComments1658733021350 implements MigrationInterface {
    name = 'StockPageComments1658733021350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_2399487992928fe4c59e56ab06f"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_414daa013658c3fc59acbace655"`);
        await queryRunner.query(`CREATE TABLE "stock_page_comment_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "comment_id" uuid NOT NULL, CONSTRAINT "PK_a0bd43e385d9f55d59d543c61fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_page_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticker" character varying(5) NOT NULL, "comment" character varying(500) NOT NULL, "post_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_37165f1237c5dc811ecd0da6a6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" ADD CONSTRAINT "FK_33bd13ffa8eb965defd2725164e" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" ADD CONSTRAINT "FK_2b747aa4adddda729082de51892" FOREIGN KEY ("comment_id") REFERENCES "stock_page_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment" ADD CONSTRAINT "FK_1949a19a86f75e5cc1e27deb608" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_2399487992928fe4c59e56ab06f" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_414daa013658c3fc59acbace655" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_414daa013658c3fc59acbace655"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_2399487992928fe4c59e56ab06f"`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment" DROP CONSTRAINT "FK_1949a19a86f75e5cc1e27deb608"`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" DROP CONSTRAINT "FK_2b747aa4adddda729082de51892"`);
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" DROP CONSTRAINT "FK_33bd13ffa8eb965defd2725164e"`);
        await queryRunner.query(`DROP TABLE "stock_page_comment"`);
        await queryRunner.query(`DROP TABLE "stock_page_comment_like"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_414daa013658c3fc59acbace655" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_2399487992928fe4c59e56ab06f" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
