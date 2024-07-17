import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { StatusIcon } from "../constants";


const StatusBadge = ({status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === 'validé',
        "bg-blue-600": status === 'en attente',
        "bg-red-600": status === 'annulé',
      })}
    >
      <Image
        src={ StatusIcon[status] }
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === 'validé',
          "text-blue-500": status === 'en attente',
          "text-red-500": status === 'annulé',
        })}
      >
        { status }
      </p>
    </div>
  );
};

export default StatusBadge;
