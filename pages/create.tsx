import React, {useState} from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'

const Draft: React.FC = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [price, setPrice] = useState(0)
    

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const body = {title, content, price}
            await fetch('api/post', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body),
            })
            await Router.push('/drafts')
        } catch (e) {
            console.log(e)
        }
    }

  return (
    <Layout>
        <div>
            <form onSubmit={submitData}>
                <h1>Uus kuulutus</h1>
                <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pealkiri"
                type={"text"}
                value={title}
                />
                <input
                autoFocus
                onChange={(e) => setPrice(parseInt(e.target.value))}
                placeholder="Summa"
                type={"number"}
                min={0}
                value={price}
                />
                <textarea 
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Kirjeldus"
                rows={8}
                value={content}
                />
                <input disabled={!content || !title || !price} type="submit" value={"Postita"} />
                <a className="back" href="#" onClick={() => Router.push('/')}>
                    või tühista
                </a>
            </form>
        </div>
        <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        input[type='number'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Draft
