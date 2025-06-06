import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
      >
        <ClerkProvider 
          appearance={{ baseTheme: dark }}
          afterSignOutUrl="/"
        >
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            storageKey="livestream-theme"
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}
