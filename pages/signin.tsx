import { getCsrfToken } from "next-auth/react"

export default function SignIn({ csrfToken }) {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <div className="bg-white  flex flex-col items-center p-10 rounded-lg drop-shadow-md w-96">
        <h1 className="text-3xl font-bold mb-5">Logi sisse</h1>
        
        <form method="post" action="/api/auth/signin/email" className="flex flex-col w-full">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="text-gray-400">Meiliaadress</label>
          <input type="email" id="email" name="email" placeholder="kasutaja@example.com" className="border w-full py-2  pl-2 mt-2 rounded-md"/>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-5">Logi sisse</button>
        </form>
        <span className="m-5 text-gray-400">või</span>
        <form method="post" action="/api/auth/signin/facebook" className="w-full">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          
          <button type="submit" className="flex items-center justify-center  border py-2 w-full rounded-md gap-2 bg-blue-100 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="30px" height="30px"><path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/></svg>
            Logi sisse Facebookiga</button>
        </form>

        <form method="post" action="/api/auth/signin/gmail" className="w-full">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          
          <button type="submit" className="flex items-center justify-center  border py-2 w-full rounded-md mt-5 gap-2 bg-blue-100 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="30px" height="30px"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Logi sisse Google'iga
          </button>
        </form>
      </div>
    
    </div>
    
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}