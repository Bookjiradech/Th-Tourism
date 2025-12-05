-- AlterTable
ALTER TABLE `Favorite` 
ADD COLUMN `externalName` VARCHAR(255) NULL,
ADD COLUMN `externalDetail` TEXT NULL,
ADD COLUMN `externalImage` VARCHAR(500) NULL,
ADD COLUMN `externalProvince` VARCHAR(100) NULL,
MODIFY COLUMN `externalSource` VARCHAR(50) NULL,
MODIFY COLUMN `externalId` VARCHAR(100) NULL;
