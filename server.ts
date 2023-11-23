import { GraphQLHTTP } from 'https://deno.land/x/gql@1.2.4/mod.ts'
import { makeExecutableSchema } from 'npm:@graphql-tools/schema@10.0.0'
import { gql } from 'https://deno.land/x/graphql_tag@0.1.2/mod.ts'
import { resolvers } from './resolvers.ts'
import { typeDefs } from './typedefs.ts'




const schema = makeExecutableSchema({ resolvers, typeDefs })

Deno.serve({
  port: 3000,
  onListen({ hostname, port }) {
    console.log(`☁  Started on http://${hostname}:${port}`)
  },
}, async (req) => {
  const { pathname } = new URL(req.url)
  return pathname === '/graphql'
    ? await GraphQLHTTP<Request>({
      schema,
      graphiql: true,
    })(req)
    : new Response('Not Found', { status: 404 })
})