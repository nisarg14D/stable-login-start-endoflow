'use server';

import { db } from '@/lib/db/drizzle';
import { messages } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function sendMessage(messageText: string) {
  const user = await getUser();
  
  if (!user || user.role !== 'patient') {
    throw new Error('Unauthorized');
  }

  try {
    await db.insert(messages).values({
      patient_id: user.id,
      sender: 'Patient',
      message_text: messageText,
      is_urgent: false,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message' };
  }
}

export async function sendUrgentAssistance(messageText: string) {
  const user = await getUser();
  
  if (!user || user.role !== 'patient') {
    throw new Error('Unauthorized');
  }

  try {
    await db.insert(messages).values({
      patient_id: user.id,
      sender: 'Patient',
      message_text: messageText,
      is_urgent: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending urgent message:', error);
    return { error: 'Failed to send urgent message' };
  }
}

export async function signOutPatient() {
  const { destroySession } = await import('@/lib/auth/session');
  await destroySession();
  redirect('/sign-in');
}