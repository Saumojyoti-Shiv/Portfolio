"use server";

import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }).max(500, { message: "Message must be at most 500 characters long." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long."}),
});

export type FormState = {
  message: string;
  type: 'success' | 'error';
} | null;

export async function submitContactForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  const validationResult = contactSchema.safeParse({ name, email, message });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(e => e.message).join(' ');
    return {
      message: `Validation failed: ${errorMessages}`,
      type: 'error',
    };
  }

  // Simulate sending an email or saving to a database
  console.log("Form data received:");
  console.log("Name:", validationResult.data.name);
  console.log("Email:", validationResult.data.email);
  console.log("Message:", validationResult.data.message);

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a potential error
  // if (Math.random() > 0.5) {
  //   return {
  //     message: "An unexpected error occurred. Please try again later.",
  //     type: 'error',
  //   };
  // }

  return {
    message: "Thank you for your message! I'll get back to you soon.",
    type: 'success',
  };
}
