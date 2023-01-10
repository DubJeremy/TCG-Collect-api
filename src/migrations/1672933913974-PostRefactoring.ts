import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1672933913974 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE card (
                id INT PRIMARY KEY NOT NULL,
                card_id VARCHAR(255) UNIQUE NOT NULL,
                preferred BOOLEAN DEFAULT false,
                to_exchange BOOLEAN DEFAULT false
                )`);
        await queryRunner.query(`CREATE TABLE card_collection (
                id INTEGER PRIMARY KEY NOT NULL,
                card_id INT REFERENCES card (id)
        )`);
        await queryRunner.query(`CREATE TABLE card_wanted (
                id INTEGER PRIMARY KEY NOT NULL,
                card_id INT REFERENCES card (id)
        )`);
        await queryRunner.query(`CREATE TABLE users (
                id INTEGER PRIMARY KEY NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                card_collection_id INT REFERENCES card_collection (id) ON DELETE CASCADE,
                card_wanted_id INT REFERENCES card_wanted (id) ON DELETE CASCADE,
                role VARCHAR(255) NOT NULL DEFAULT 'user',
                createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE card");
        await queryRunner.query("DROP TABLE card_collection");
        await queryRunner.query("DROP TABLE card_wanted");
        await queryRunner.query("DROP TABLE user");
    }
}
