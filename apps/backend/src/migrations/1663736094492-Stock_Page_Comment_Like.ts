import {MigrationInterface, QueryRunner} from "typeorm";

export class StockPageCommentLike1663736094492 implements MigrationInterface {
    name = 'StockPageCommentLike1663736094492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" ADD "is_liked" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_page_comment_like" DROP COLUMN "is_liked"`);
    }

}
