import { render } from "@react-email/components";
import { ComponentType } from "react";
import { sendEmail } from "./mailgun";

export type MailTemplate<T = any> = {
  subject: string;
  type?: string;
  templateId?: string;
} & ComponentType<T>;

export type MailProps<T> = {
  email: string;
} & T;

export const sendMailTemplate = async <T extends object>(
  template: MailTemplate<T>,
  props: MailProps<T>,
  subject?: string,
) => {
  if (!template) {
    console.error("No template provided");
    return;
  }

  const Template = template;
  const element = <Template {...props} />;

  const html = await render(element, { pretty: true });
  const plain = await render(element, { plainText: true });
  
  let status = "pending";

  try {
    const result = await sendEmail({
      to: props.email,
      subject: subject || template.subject,
      html: html,
      text: plain,
    });

    console.log(`🚀 Mail sent to ${props.email}`);
  } catch (e: any) {
    console.error(`🚨 Mail issue to ${props.email}: ${e}`);
    status = "error";
  }

  // const type = template.type || "unknown";
  // const templateId = template.templateId || normalizeString(template.subject);

  // await prisma.mails.create({
  //   data: {
  //     email: props.email,
  //     subject: template.subject,
  //     type: type,
  //     status: status,
  //     templateId: templateId,
  //   },
  // });
};

// export const checkIfMailAlreadySent = async (email: string, templateId: string) => {
//   const mails = await prisma.mails.findMany({
//     where: {
//       email,
//       templateId,
//     },
//   });
//   return mails.length > 0;
// }