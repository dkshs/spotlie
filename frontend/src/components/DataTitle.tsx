interface DataTitleProps {
  readonly title: string;
}

export function DataTitle({ title }: DataTitleProps) {
  return (
    <h1
      className={`mb-3 ${
        !title.includes(" ") ? "break-all" : "break-words"
      } font-sans text-3xl font-extrabold md:text-6xl`}
    >
      {title}
    </h1>
  );
}
