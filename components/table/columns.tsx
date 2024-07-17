"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";
import AppointmentModal from "../AppointmentModal";
import { formatDateTime } from "../../lib/utils";
import { Appointment } from "../../types/appwrite.types";
import { Doctors } from "../../constants";


export const columns: ColumnDef<Appointment>[] = [
  {
    header: '#',
    cell: ({ row }) => {
      return <p className="text-14-medium">{ row.index + 1 }</p>;
    },
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{ appointment.patient.name }</p>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={ appointment.status } />
        </div>
      );
    },
  },
  {
    accessorKey: 'schedule',
    header: 'Rendez-vous',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          { formatDateTime(appointment.schedule).dateTime }
        </p>
      );
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Doecteur',
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find((doctor) => doctor.name === appointment.primaryPhysician);
      return (
        <div className="flex items-center gap-3">
          <Image
            src={ doctor?.image! }
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. { doctor?.name }</p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={ appointment.patient.$id }
            userId={ appointment.userId }
            appointment={ appointment }
            type='valide'
            title='Valider le rendez-vous'
            description='Veuillez confirmer les détails suivants pour valider.'
          />
          <AppointmentModal
            patientId={ appointment.patient.$id }
            userId={ appointment.userId }
            appointment={ appointment }
            type='annule'
            title='Annuler le rendez-vous'
            description='Etes-vous sûr de vouloir annuler le rendez-vous ?'
          />
        </div>
      );
    },
  },
];
