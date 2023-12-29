import { unstable_createTheme as unstableCreateTheme } from "@clerk/themes";

export const clerkTheme = unstableCreateTheme({
  elements: {
    card: "bg-card border border-primary/50",
    modalCloseButton:
      "text-foreground hover:bg-secondary/80 active:bg-secondary focus:ring focus:ring-ring",
    identityPreview: "bg-secondary",
    identityPreviewText: "text-foreground/60",
    identityPreviewEditButton:
      "text-primary/90 hover:text-primary active:text-primary focus:ring focus:ring-ring",
    headerTitle: "text-foreground",
    headerSubtitle: "text-foreground/60",
    form: "[&_.cl-internal-3vf5mz]:text-foreground",
    formHeaderTitle: "text-foreground",
    formHeaderSubtitle: "text-foreground/60",
    formFieldLabel: "text-foreground",
    formFieldInput:
      "border-input bg-background text-foreground ring-ring focus:ring-1 dark:border-zinc-700",
    formFieldInputShowPasswordButton:
      "text-foreground/40 hover:text-foreground/70",
    formButtonPrimary:
      "bg-primary/80 duration-200 hover:bg-primary focus:bg-primary focus:ring ring-ring",
    formButtonReset:
      "hover:bg-primary/20 active:bg-primary/30 text-primary duration-300 focus:ring focus:ring-ring",
    formResendCodeLink: "text-primary hover:text-primary",
    formFieldSuccessText: "text-green-600",
    formFieldAction__password:
      "text-primary hover:text-primary active:text-primary focus:ring focus:ring-ring",
    fileDropAreaButtonPrimary:
      "hover:bg-primary/20 active:bg-primary/30 text-primary duration-300 focus:ring focus:ring-ring",
    fileDropAreaBox: "bg-secondary dark:bg-secondary/60",
    fileDropAreaIconBox: "bg-background",
    fileDropAreaIcon: "text-foreground/60",
    fileDropAreaHint: "text-foreground/60 font-medium",
    headerBackRow:
      "[&_a]:text-primary [&_a]:hover:text-primary [&_a]:active:text-primary [&_a]:focus:ring [&_a]:focus:ring-ring",
    otpCodeFieldInput:
      "border-b-2 border-border text-foreground focus:border-primary",
    alternativeMethodsBlockButton:
      "text-foreground border border-input [&_svg]:text-foreground/80 hover:bg-secondary active:bg-secondary focus:ring focus:ring-ring",
    main: "[&>.cl-internal-1b63r8w]:text-foreground [&_.cl-internal-fqx4fd]:text-foreground/60 [&>.cl-internal-rsjg4y]:text-foreground/60 [&_.cl-internal-f7yy9s]:text-foreground [&_.cl-internal-f7yy9s_svg]:text-foreground/80 [&_.cl-internal-f7yy9s]:bg-secondary/40 [&_.cl-internal-f7yy9s]:hover:bg-secondary/60",
    footerActionLink:
      "text-primary hover:text-primary active:text-primary focus:ring focus:ring-ring",
    footerActionText: "text-foreground/60",
    userPreviewMainIdentifier: "text-foreground",
    userPreviewSecondaryIdentifier: "text-foreground/60",
    userButtonPopoverActionButton:
      "hover:bg-secondary/60 focus-visible:bg-secondary/60 active:bg-secondary",
    userButtonPopoverActionButtonText: "text-foreground/60",
    userButtonPopoverActionButtonIconBox: "[&_*]:text-foreground/40",
    userButtonPopoverFooter: "hidden",
    userButtonTrigger: "focus:ring focus:ring-ring",
    profileSectionTitle: "border-b border-border",
    profileSectionTitleText: "text-foreground",
    profileSectionContent:
      "[&_p:not(.cl-internal-fqx4fd)]:text-foreground [&_.cl-internal-fqx4fd]:text-foreground/60",
    profileSectionPrimaryButton:
      "text-primary hover:bg-primary/20 active:bg-primary/30 focus:ring focus:ring-ring",
    accordionTriggerButton:
      "text-foreground hover:bg-secondary/80 focus:ring focus:ring-ring active:bg-secondary",
    navbarButton:
      "text-foreground/80 data-[active=true]:text-foreground hover:bg-secondary focus:ring focus:ring-ring",
    avatarImageActionsUpload:
      "text-primary hover:text-primary active:text-primary focus:ring focus:ring-ring",
    breadcrumbsItem__currentPage: "text-foreground",
    breadcrumbsItem: "text-foreground/60 focus:ring focus:ring-ring",
    breadcrumbsItemDivider: "text-foreground/60",
    badge: "text-primary bg-primary/20",
  },
});
