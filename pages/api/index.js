const faunadb = require('faunadb')
const clockit = require('clockit')

// your secret hash
const secret = process.env.FAUNADB_SECRET_KEY
const q = faunadb.query
const client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
  try {
    console.log(`${req.method} ${req.url}`)
    let timer = clockit.start()
    const dbs = await client.query(
      q.Map(
        // iterate each item in result
        q.Paginate(
          // make paginatable
          q.Match(
            // query index
            q.Index('all_customers') // specify source
          )
        ),
        ref => q.Get(ref) // lookup each result by its reference
      )
    )
    console.log(`db time: ${timer.ms}ms`)
    console.log('dbs:', dbs)
    console.log('fauna client:', client)
    // ok
    res.status(200).json(dbs.data)
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message })
  }
}