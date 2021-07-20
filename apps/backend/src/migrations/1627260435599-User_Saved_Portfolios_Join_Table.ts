import {MigrationInterface, QueryRunner} from "typeorm";

export class UserSavedPortfoliosJoinTable1627260435599 implements MigrationInterface {
    name = 'UserSavedPortfoliosJoinTable1627260435599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_account_saved_portfolios_portfolio" ("userAccountId" uuid NOT NULL, "portfolioId" uuid NOT NULL, CONSTRAINT "PK_3116cb3833d3e246cd96e9e6395" PRIMARY KEY ("userAccountId", "portfolioId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2399487992928fe4c59e56ab06" ON "user_account_saved_portfolios_portfolio" ("userAccountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_414daa013658c3fc59acbace65" ON "user_account_saved_portfolios_portfolio" ("portfolioId") `);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_2399487992928fe4c59e56ab06f" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" ADD CONSTRAINT "FK_414daa013658c3fc59acbace655" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_414daa013658c3fc59acbace655"`);
        await queryRunner.query(`ALTER TABLE "user_account_saved_portfolios_portfolio" DROP CONSTRAINT "FK_2399487992928fe4c59e56ab06f"`);
        await queryRunner.query(`DROP INDEX "IDX_414daa013658c3fc59acbace65"`);
        await queryRunner.query(`DROP INDEX "IDX_2399487992928fe4c59e56ab06"`);
        await queryRunner.query(`DROP TABLE "user_account_saved_portfolios_portfolio"`);
    }

}
