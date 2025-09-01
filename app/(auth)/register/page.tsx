import { Metadata } from "next";

import ClientPageRegister from "./ClientPageRegister";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <ClientPageRegister />;
}
