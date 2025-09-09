// in src/lib/auth/validation.ts

import { z } from 'zod';

// This is a simplified version of the template's helper function
export function validatedAction<T extends z.ZodTypeAny>(
  schema: T,
  action: (data: z.infer<T>) => Promise<{ error?: string; [key: string]: any } | void>
) {
  return async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return { error: 'Invalid form data.' };
    }
    return action(parsed.data);
  };
}