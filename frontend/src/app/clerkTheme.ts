import { experimental_createTheme as createTheme, dark } from "@clerk/themes";

export const clerkTheme = createTheme({
  baseTheme: dark,
  elements: {
    // Box
    logoBox: "[&>a]:border [&>a]:border-primary/50",
    cardBox: "border border-primary/50 bg-card",
    scrollBox: "bg-card !shadow-none !border-l border-input",
    pageScrollBox: "!border-t border-input",
    // Card
    card: "bg-card rounded-none",
    actionCard: "border border-primary/50 bg-card",
    // Header
    headerTitle: "text-foreground",
    headerSubtitle: "text-foreground/70",
    identityPreviewText: "text-foreground/70",
    identityPreviewEditButton: "text-primary/80 hover:text-primary active:text-primary focus:ring focus:ring-ring",
    // Form
    formFieldLabel: "text-foreground",
    formFieldHintText: "text-foreground/70",
    formFieldInput: "ring-1 ring-input py-2 bg-background text-foreground !shadow-none ring-offset-input hover:ring-foreground/20 focus:ring-2 focus:ring-ring focus:ring-offset-2",
    otpCodeFieldInput: "ring-1 ring-input bg-background text-foreground !shadow-none ring-offset-input hover:ring-foreground/40 focus:ring-2 focus:ring-ring focus:ring-offset-2",
    formFieldInputShowPasswordButton: "text-foreground/40 ring-ring !shadow-none hover:text-foreground/70 focus:ring",
    formButtonPrimary: "text-foreground bg-primary/60 duration-200 hover:bg-primary/80 focus:bg-primary/80 !shadow-none ring-offset-card ring-ring focus:ring-2 focus:ring-offset-2",
    buttonArrowIcon: "text-foreground",
    formButtonReset: "hover:bg-secondary/80 active:bg-secondary duration-300 text-foreground focus:ring-2 focus:ring-ring",
    formFieldAction: "text-primary ring-ring rounded hover:text-primary active:text-primary focus:outline-none focus:ring-2",
    formFieldSuccessText: "text-green-600",
    formResendCodeLink: "text-primary ring-ring rounded hover:text-primary active:text-primary focus:outline-none focus:ring-2",
    formFieldRadioLabelTitle: "text-foreground",
    // Alt Button
    alternativeMethodsBlockButton: "!border border-input py-2 bg-card text-foreground/70 ring-ring !shadow-none ring-offset-card hover:bg-input/80 focus:ring-2 focus:ring-offset-2",
    avatarImageActionsUpload: "text-foreground ring-1 ring-input !shadow-none ring-offset-input hover:bg-secondary/80 active:bg-secondary focus:ring-ring focus:ring-offset-2",
    avatarImageActionsRemove: "!shadow-none hover:bg-secondary/80 active:bg-secondary focus:ring-2 focus:ring-ring",
    // User Menu
    userButtonTrigger: "!shadow-none ring-ring ring-offset-input activate:ring-2 focus:ring-2 focus:ring-offset-2",
    userButtonPopoverCard: "border border-primary/50",
    userButtonPopoverMain: "bg-card",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverActionButton: "hover:bg-secondary/80",
    menuButton: "text-foreground hover:bg-secondary active:bg-secondary focus:ring-2 focus:ring-ring",
    menuItem: "hover:bg-secondary active:bg-secondary",
    modalCloseButton: "text-foreground hover:bg-secondary active:bg-secondary focus:ring-2 focus:ring-ring",
    // Profile
    profileSectionPrimaryButton: "text-foreground bg-secondary/60 duration-200 hover:bg-secondary focus:bg-primary/80 !shadow-none ring-offset-card ring-ring focus:ring-2 focus:ring-offset-2",
    // NavBar
    navbar: "!bg-none !bg-card",
    navbarMobileMenuRow: "!bg-none !bg-card",
    navbarMobileMenuButton: "text-foreground/80 hover:bg-secondary focus:ring-1 focus:ring-ring",
    navbarButton: "text-foreground/80 data-[active=true]:text-foreground hover:bg-secondary focus:ring-1 focus:ring-ring",
    // Footer
    footer: "[&>.cl-internal-180wb59]:hidden bg-card",
    footerAction: "bg-card/60 w-full flex justify-center",
    footerActionLink: "text-primary ring-ring rounded hover:text-primary active:text-primary focus:outline-none focus:ring-2",
    // Extras
    badge: "text-primary bg-primary/20",
    dividerText: "text-foreground/70",
  },
});
