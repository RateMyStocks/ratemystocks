import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdditionalUserColumns1631501858665 implements MigrationInterface {
    name = 'AddAdditionalUserColumns1631501858665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "date_joined" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "last_login" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "bio" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "emailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stock_rating" ADD CONSTRAINT "CHK_602e09a9c5728e0b057a232236" CHECK ("stock_rating" <> 'buy' OR "stock_rating" <> 'hold' OR "stock_rating" <> 'sell')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_rating" DROP CONSTRAINT "CHK_602e09a9c5728e0b057a232236"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "emailVerified"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "date_joined"`);
    }

}
