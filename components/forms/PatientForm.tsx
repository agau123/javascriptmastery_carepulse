"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "../../lib/validation";
import { createUser } from "../../lib/actions/patient.actions";


export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
};


const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      const newUser = await createUser(userData);
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Salut à tous 👋</h1>
          <p className="text-dark-700">Planifie ton premier rendez-vous.</p>
        </section>
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.INPUT }
          name="name"
          label="Nom complet"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="utilisateur"
        />
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.INPUT }
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.PHONE_INPUT }
          name="phone"
          label="Numéro de téléphone"
          placeholder="0605040302"
        />
        <SubmitButton isLoading={ isLoading }>Commencer</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
