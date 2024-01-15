'use server'
import { Resend } from "resend"
export default function Mailer()
{
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

    async function getData() {

        await resend.emails.send({
          from:'testwebpageno1@gmail.com',
          to:'hackerone.attackerr@gmail.com',
          subject:'check',
          html:'<p>Yo buddy</p>'
        })
      }
    return(
        <button onClick={()=> getData()}>testmail</button>

    )
}