-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "cardCurrency" TEXT,
ADD COLUMN     "cardDate" TEXT,
ADD COLUMN     "cardNumber" TEXT,
ALTER COLUMN "wallet" DROP NOT NULL;
