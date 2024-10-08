import React from 'react'
import BackButton from "../components/BackButton/BackButton";

const Pricing = () => {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <section className="bg-white w-full max-w-[25%] p-5 rounded-lg shadow-lg">
        <nav>
          <BackButton route={"/menu"} />
        </nav>
        <article>Precificação</article>
      </section>
    </div>
  )
}

export default Pricing
