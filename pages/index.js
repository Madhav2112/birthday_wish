export default function Home() {
  return (
    <>
      <h1>Redirecting...</h1>
      <script dangerouslySetInnerHTML={{
        __html: `window.location.href = "/index.html";`
      }} />
    </>
  );
}
