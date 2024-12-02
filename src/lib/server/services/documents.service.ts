import type { Document } from "@prisma/client";
import "server-only";

import { prisma } from "../providers/prisma";

class DocumentsService {
	public async createDocument(userId: string, filePath: string) {
		return await prisma.document.create({
			data: {
				userId,
				path: filePath,
			},
		});
	}

	public async getDocumentById(documentId: string): Promise<Document | null> {
		return await prisma.document.findUnique({
			where: { id: documentId },
		});
	}

	public async getDocumentsByUserId(userId: string): Promise<Document[]> {
		return await prisma.document.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
	}

	public async deleteDocumentById(documentId: string): Promise<Document> {
		return await prisma.document.delete({
			where: { id: documentId },
		});
	}

	public async updateDocumentPath(
		documentId: string,
		newPath: string,
	): Promise<Document> {
		return await prisma.document.update({
			where: { id: documentId },
			data: { path: newPath },
		});
	}

	public async deleteDocumentsByUserId(userId: string): Promise<number> {
		const deleteResult = await prisma.document.deleteMany({
			where: { userId },
		});
		return deleteResult.count;
	}
}

export const documentsService = new DocumentsService();
