import { z } from "zod";

export const giftBoxSchema = z.object({
	recipientName: z
		.string()
		.trim()
		.min(1, "Il nome del destinatario è obbligatorio")
		.max(80, "Massimo 80 caratteri"),
	senderName: z
		.string()
		.trim()
		.min(1, "Il tuo nome è obbligatorio")
		.max(80, "Massimo 80 caratteri"),
	message: z
		.string()
		.trim()
		.min(3, "Scrivi almeno qualche parola")
		.max(250, "Il messaggio può contenere al massimo 250 caratteri"),
});

export type GiftBoxSchema = z.output<typeof giftBoxSchema>;
