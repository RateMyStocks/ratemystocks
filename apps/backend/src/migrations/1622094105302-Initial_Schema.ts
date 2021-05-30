import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSchema1622094105302 implements MigrationInterface {
    name = 'InitialSchema1622094105302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticker" character varying NOT NULL, "stock_rating" character varying NOT NULL, "active" boolean, "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_account_id" uuid NOT NULL, CONSTRAINT "PK_27a68148f8d0ad732f95a679ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2fe6172b6eb3230fc4c01c2136" ON "stock_rating" ("ticker", "user_account_id") WHERE "active" = true`);
        await queryRunner.query(`CREATE TYPE "user_account_spirit_animal_enum" AS ENUM('antelope', 'arctic-wolf', 'baby-fox', 'beaver', 'boar', 'bull', 'bulldog', 'bunny', 'camel', 'cat', 'chicken', 'chimpanzee', 'chipmunk', 'cobra', 'cow', 'deer', 'donkey', 'elephant', 'fox', 'foxhound', 'gerbil', 'giraffe', 'goat', 'goldfish', 'goose', 'greyhound', 'hamster', 'hare', 'hen', 'hippo', 'koala', 'lamb', 'lion', 'macaque', 'monkey', 'mouse', 'ostrich', 'panda', 'penguin', 'pig', 'polar-bear', 'poodle', 'rabbit', 'red-panda', 'rhino', 'tiger', 'westie', 'wolf')`);
        await queryRunner.query(`CREATE TABLE "user_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "email" citext NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "spirit_animal" "user_account_spirit_animal_enum" NOT NULL DEFAULT 'antelope', CONSTRAINT "uq_user_account_email" UNIQUE ("email"), CONSTRAINT "uq_user_account_username" UNIQUE ("username"), CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "portfolio_id" uuid NOT NULL, "is_liked" boolean NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "uq_portfolioRating_portfolio_user" UNIQUE ("portfolio_id", "user_id"), CONSTRAINT "PK_014e0fd7219938eda2e181cb7c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio_stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticker" character varying(5) NOT NULL, "weighting" numeric(5,2) NOT NULL DEFAULT '0', "portfolio_id" uuid NOT NULL, CONSTRAINT "uq_portfolioStock_ticker" UNIQUE ("ticker", "portfolio_id"), CONSTRAINT "CHK_255e59f9124663df143853477f" CHECK ("weighting" >= 0 AND "weighting" <= 100), CONSTRAINT "PK_d6adfaabbfdf5fe69c40941cfec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL DEFAULT '', "description" character varying(500), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "uq_portfolio_name_userId" UNIQUE ("name", "user_id"), CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_rating" ADD CONSTRAINT "FK_ecef56ff3bdfece86ea4d3faf22" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" ADD CONSTRAINT "FK_96b07de0c345e7fc6061d3db274" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" ADD CONSTRAINT "FK_009e2c71d949ff894a4bc9ec77e" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portfolio_stock" ADD CONSTRAINT "FK_160b28c487a05554e589a01542e" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD CONSTRAINT "FK_89055af4a272bb99a3d3ed2f247" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portfolio" DROP CONSTRAINT "FK_89055af4a272bb99a3d3ed2f247"`);
        await queryRunner.query(`ALTER TABLE "portfolio_stock" DROP CONSTRAINT "FK_160b28c487a05554e589a01542e"`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" DROP CONSTRAINT "FK_009e2c71d949ff894a4bc9ec77e"`);
        await queryRunner.query(`ALTER TABLE "portfolio_rating" DROP CONSTRAINT "FK_96b07de0c345e7fc6061d3db274"`);
        await queryRunner.query(`ALTER TABLE "stock_rating" DROP CONSTRAINT "FK_ecef56ff3bdfece86ea4d3faf22"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
        await queryRunner.query(`DROP TABLE "portfolio_stock"`);
        await queryRunner.query(`DROP TABLE "portfolio_rating"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
        await queryRunner.query(`DROP TYPE "user_account_spirit_animal_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_2fe6172b6eb3230fc4c01c2136"`);
        await queryRunner.query(`DROP TABLE "stock_rating"`);
    }

}
