
export default function MaxWidthWrapper({ children }) {
  return (
    <div className="mx-auto w-full max-w-screen-lg md:px-2.5">{children}</div>
  );
}