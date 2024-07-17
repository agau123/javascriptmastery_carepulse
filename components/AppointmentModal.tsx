"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "../types/appwrite.types";


const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: 'valide' | 'annule';
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === 'valide' && "text-green-500"}`}
        >
          { type }z
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            { type }z le rendez-vous
          </DialogTitle>
          <DialogDescription>
            Veuillez remplir les informations suivantes pour { type }r rendez-vous
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          type={ type }
          userId={ userId }
          patientId={ patientId }
          appointment={ appointment }
          setOpen={ setOpen }
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
