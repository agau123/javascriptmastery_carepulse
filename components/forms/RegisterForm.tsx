"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "../../components/ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";
import CustomFormField from "../CustomFormField";
import FileUploader from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "../../lib/validation";
import { FormFieldType } from "./PatientForm";
import { registerPatient } from "../../lib/actions/patient.actions";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "../../constants";


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    let formData;
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      // @ts-ignore
      const patient = await registerPatient(patientData);
      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Bienvenue 👋</h1>
          <p className="text-dark-700">Donne nous un peu plus d&apos;informations sur toi.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Information personnelle</h2>
          </div>
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
        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.DATE_PICKER }
            name="birthdate"
            label="Date d'anniversaire"
          />
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.SKELETON }
            name="gender"
            label="Sexe"
            renderSkeleton={ (field) => (
              <FormControl>
                <RadioGroup
                  defaultValue={ field.value }
                  onValueChange={ field.onChange }
                  className="flex h-11 gap-6 xl:justify-between"
                >
                  { GenderOptions.map((option) => (
                    <div key={ option } className="radio-group">
                      <RadioGroupItem
                        value={ option }
                        id={ option }
                      />
                      <Label htmlFor={ option } className="cursor-pointer">
                        { option }
                      </Label>
                    </div>
                  )) }
                </RadioGroup>
              </FormControl>
            ) }
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.INPUT }
            name="address"
            label="Adresse"
            placeholder="1 rue perdu 59000 Lille"
          />
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.INPUT }
            name="occupation"
            label="Métier"
            placeholder="Ingénieur"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.INPUT }
            name="emergencyContactName"
            label="Contact en cas d'urgence"
            placeholder="Le nom du tuteur"
          />
          <CustomFormField
            control={ form.control }
            fieldType={ FormFieldType.PHONE_INPUT }
            name="emergencyContactNumber"
            label="Numéro en cas d'urgence"
            placeholder="0605040302"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Information médicale</h2>
          </div>
        </section>
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.SELECT }
          name="primaryPhysician"
          label="Docteur principal"
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
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.INPUT }
              name="insuranceProvider"
              label="Mutuelle"
              placeholder="Mutuelle des rigolos"
            />
            <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.INPUT }
              name="insurancePolicyNumber"
              label="Numéro de mutuelle"
              placeholder="ABC123456789"
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.TEXTAREA }
              name="allergies"
              label="Allergies"
              placeholder="Cacahuète, pollen, ..."
            />
            <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.TEXTAREA }
              name="currentMedication"
              label="Traitement en cours"
              placeholder="Ibuprofène 200mg, paracétamol 500mg, ..."
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.TEXTAREA }
              name="familyMedicalHistory"
              label="Histoire médicale familialle"
              placeholder="Ma mère a eu un cancer"
            />
            <CustomFormField
              control={ form.control }
              fieldType={ FormFieldType.TEXTAREA }
              name="pastMedicalHistory"
              label="Histoire médicale passée"
              placeholder="Appendicectomie, amygdalectomie, ..."
            />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification et vérification</h2>
          </div>
        </section>
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.SELECT }
          name="identificationType"
          label="Type d'identification"
          placeholder="Sélectionnez un type d'identification"
        >
          { IdentificationTypes.map((type) => (
            <SelectItem
              key={ type }
              value={ type }
            >
              { type }
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.INPUT }
          name="identificationNumber"
          label="Numéro d'identification"
          placeholder="123456789"
        />
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.SKELETON }
          name="identificationDocument"
          label="Scan du document d'identification"
          renderSkeleton={ (field) => (
            <FormControl>
              <FileUploader
                files={ field.value }
                onChange={ field.onChange }
              />
            </FormControl>
          ) }
        />
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consentement et confidentialité</h2>
          </div>
        </section>
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.CHECKBOX }
          name="treatmentConsent"
          label="J'accepte le traitement"
        />
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.CHECKBOX }
          name="disclosureConsent"
          label="J'accepte la divulgation d'informations"
        />
        <CustomFormField
          control={ form.control }
          fieldType={ FormFieldType.CHECKBOX }
          name="privacyConsent"
          label="J'accepte la politique de confidentialité"
        />
        <SubmitButton isLoading={ isLoading }>Commencer</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
