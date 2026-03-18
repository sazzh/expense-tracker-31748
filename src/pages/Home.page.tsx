export function HomePage() {
  return (
    <>
      <h1>HELLO</h1>

      <button onClick={() => document.body.classList.toggle("dark")}>Toggle</button>
    </>
  )
}