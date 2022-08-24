import getFeed from "./getFeed";

export default async function handle(req, res) {
    const result = await getFeed('google')
    res.json(result)
}