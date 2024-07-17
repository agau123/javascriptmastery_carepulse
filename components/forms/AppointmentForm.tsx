"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";
import { FormFieldType } from "./PatientForm";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "../../lib/validation";
import { createAppointment, updateAppointment } from "../../lib/actions/appointment.actions";
import { Appointment } from "../../types/appwrite.types";
import { Doctors } from "../../constants";


const AppointmentForm = ({
  type = 'crée',
  userId,
  patientId,
  appointment,
  setOpen,
}: {
  type: 'crée' | 'annule' | 'valide';
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : '',
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case 'valide':
        status = 'validé';
        break;
      case 'annule':
        status = 'annulé';
        break;
      default:
        status = 'en attente';
    }
    try {
      if (type === 'crée' && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const newAppointment = await createAppointment(appointment);
        if (newAppointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case 'annule':
      buttonLabel = 'Annuler le rendez-vous';
      break;
    case 'crée':
      buttonLabel = 'Créer un rendez-vous';
      break;
    case 'valide':
      buttonLabel = 'Valider le rendez-vous';
      break;
    default:
      break;
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 flex-1">
        { type === 'crée' && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Nouveau rendez-vous</h1>
            <p className="text-dark-700">Demande un nouveau rendez-vous en 10 secondes.</p>
          </section>
        )}
        { type !== 'annule' && (
          <>
            <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.SELECT }
              name="primaryPhysician"
              label="Docteur"
              placeholder="Sélectionnez un docteur"
            >
              { Doctors.map((doctor) => (
                <SelectItem
                  key={ doctor.name }
                  value={ doctor.name }
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={ doctor.image }
                      alt={ doctor.name }
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{ doctor.name }</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.DATE_PICKER }
              name="schedule"
              label="Date du rendez-vous"
              showTimeSelect
              dateFormat="dd/MM/yyyy - hh:mm"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={ form.control }
                fieldType={ FormFieldType.TEXTAREA }
                name="reason"
                label="Raison du rendez-vous"
                placeholder="Saisissez la raison du rendez-vous"
              />
              <CustomFormField
                control={ form.control }
                fieldType={ FormFieldType.TEXTAREA }
                name="note"
                label="Remarques"
                placeholder="Saisissez vos remarques"
              />
            </div>
          </>
        )}
        { type === 'annule' && (
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.TEXTAREA }
            name="cancellationReason"
            label="Raison de l'annulation"
            placeholder="Saisissez la raison de l'annulation"
          />
        )}
        <SubmitButton
          isLoading={ isLoading }
          className={ `${type === 'annule' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full` }
        >
          { buttonLabel }
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
