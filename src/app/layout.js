import ThemeRegistry from "@/theme/ThemeRegistry";
import ServiceWorkerRegister from "@/context/ServiceWorkerRegister";
import ServiceWorkerRegisterFirebase from "@/context/ServiceWorkerRegisterFirebase";
import { AuthProvider } from "@/context/AuthContext";

import "@/app/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ModalProvider } from "@/context/ModalContext";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeRegistry>
        {/* <ServiceWorkerRegister> */}
        {/* <ServiceWorkerRegisterWorkBox> */}
        <ServiceWorkerRegisterFirebase>
          <ModalProvider>
            <AuthProvider>
              <body>{children}</body>
            </AuthProvider>
          </ModalProvider>
        </ServiceWorkerRegisterFirebase>
        {/* </ServiceWorkerRegister> */}
        {/* </ServiceWorkerRegisterWorkBox> */}
      </ThemeRegistry>
    </html>
  );
}
