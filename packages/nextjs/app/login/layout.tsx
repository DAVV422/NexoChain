import Providers from "../providers";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <Providers>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
