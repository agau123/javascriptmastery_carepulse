import { z } from "zod";


export const UserFormValidation = z.object({
  name: z.string()
    .min(2, "Le nom doit avoir au moins 2 caractères.")
    .max(50, "Le nom doit avoir au plus 50 caractères."),
  email: z.string().email("Adresse email non valide."),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone non valide."),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Le nom doit avoir au moins 2 caractères.")
    .max(50, "Le nom doit avoir au plus 50 caractères."),
  email: z.string().email("Adresse email non valide."),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone non valide."),
  birthDate: z.coerce.date(),
  gender: z.enum(["Homme", "Femme"]),
  address: z
    .string()
    .min(5, "L'adresse doit avoir au moins 5 caractères.")
    .max(500, "L'adresse doit avoir au plus 500 caractères."),
  occupation: z
    .string()
    .min(2, "Le métier doit avoir au moins 2 caractères.")
    .max(500, "Le métier doit avoir au plus 50 caractères."),
  emergencyContactName: z
    .string()
    .min(2, "Le nom du contact doit avoir au moins 2 caractères.")
    .max(50, "Le nom du contact doit avoir au plus 50 caractères."),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Numéro en cas d'urgence non valide."
    ),
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un docteur."),
  insuranceProvider: z
    .string()
    .min(2, "Le nom de la mutuelle doit avoir au moins 2 caractères.")
    .max(50, "Le nom de la mutuelle doit avoir au plus 50 caractères."),
  insurancePolicyNumber: z
    .string()
    .min(2, "Le numéro de la mutuelle doit avoir au moins 2 caractères.")
    .max(50, "Le numéro de mutuelle doit avoir au plus 50 caractères."),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez accepter le traitement pour pouvoir continuer.",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez accepter la divulgation pour pouvoir continuer.",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez accepter la politique de confidentialité pour pouvoir continuer.",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un docteur."),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Le motif doit avoir au moins 2 caractères.")
    .max(500, "Le motif doit avoir au plus 500 caractères."),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un docteur."),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un docteur."),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Le motif doit avoir au moins 2 caractères.")
    .max(500, "Le motif doit avoir au plus 500 caractères."),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
