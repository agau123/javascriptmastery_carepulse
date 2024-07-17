import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import AppointmentForm from "../../../../components/forms/AppointmentForm";
import { getPatient } from "../../../../lib/actions/patient.actions";


export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId);
  Sentry.metrics.set('user_view_new-appointment', patient.name);

  return (
    <div className="flex h-screen maw-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="crée"
            userId={ userId }
            patientId={ patient.$id }
          />
          <p className="copyright mt-10 py-12">
            © 2024 CarePluse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};
