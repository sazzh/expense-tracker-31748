import './App.css'

export default function App() {
  return (
    <>
        <div id="testdiv">
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>

      <button onClick={() => document.body.classList.toggle("dark")}>Toggle</button>
    </>
  )
}
