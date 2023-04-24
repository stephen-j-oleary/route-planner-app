import DefaultLayout from "@/components/Layouts/Default";


export default function ErrorLayout({
  children,
  ...props
}) {
  return (
    <DefaultLayout
      headingComponent="p"
      justifyContent="center"
      spacing={3}
      {...props}
    >
      {children}
    </DefaultLayout>
  );
}