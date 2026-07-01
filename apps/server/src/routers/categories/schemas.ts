import z from 'zod';

const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(80)
});

export { categoryInputSchema };
