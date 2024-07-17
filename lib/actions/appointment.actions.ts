"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "../../types/appwrite.types";


export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment,
    );
    revalidatePath('/admin');
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("Une erreur est survenue lors de la création d'un nouveau rendez-vous :", error);
  }
};


export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error("Une erreur est survenue lors de la récupération du rendez-vous :", error);
  }
};


export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );
    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");
    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");
    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");
    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case 'validé':
            acc.scheduledCount++;
            break;
          case 'en attente':
            acc.pendingCount++;
            break;
          case 'annulé':
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts,
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupérations des rendez-vous récents :', error);
  }
};


export const updateAppointment = async ({
  userId,
  appointmentId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updatedAppointment) throw Error;
    const smsMessage = `Salutations de CarePulse. ${type === 'valide' ? `Votre rendez-vous est confirmé pour le ${formatDateTime(appointment.schedule!).dateTime} avec Dr. ${appointment.primaryPhysician}` : `Nous avons le regret de vous informer que votre rendez-vous du ${formatDateTime(appointment.schedule!).dateTime} a été annulé. La raison : ${appointment.cancellationReason}`}.`;
    await sendSMSNotification(userId, smsMessage);
    revalidatePath('/admin');
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Une erreur est survenue lors de la modification du rendez-vous :", error);
  }
};


export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("Une erreur est survenue lors de l'envoi du SMS :", error);
  }
};
