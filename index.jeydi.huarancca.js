const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const { v4: uuid } = require('uuid')

const url="http://localhost:3001"
var cuentas = []

const typeDefs = gql`

  type persona{
    id: ID!
    nombre: String!

  }

  type cuenta {
    id: ID!
    cuenta: String!
    nombre: String!
    persona: String!
    dinero: Int!

  }

  type dinerototal{
    data: Int!
    mensaje: String!

  }

  type Mutation {
    "Tranferir a otra cuenta"
    transferencia: String!

  }

  type Query {
    porcadapersonasaldo(id: ID!): dinerototal!
    cuenta(id:ID!): cuenta!

  }

`

const resolvers = {

  Query: {
    porcadapersonasaldo : (root, args) =>{
      const { id } = args
      return totaldinero(id)
    },

    account: (root, args)=> {
      const { id } = args
      return darcuenta(id)
    }
  },
  Mutation: {
    trasferencia: async (root, args) =>{
      const { idorigen } = args
      const { iddestino } = args
      const { dinero } = args

      const resultado =  Transferir(idorigen, iddestino, dinero)
      return resultado
    }
  } 
}

const totaldinero = async (id)=>{
  const { data } = await axios(`http://localhost:3001/api/cuenta/dinerototal/${id}`)
  return data.results
}

const darcuenta = async (id)=>{
  const  {data}  = await axios(`http://localhost:3001/api/cuenta/${id}`)
  return data
}

const Transferir = async (idorigen, iddestino, dinero)=>{
  const  {data}  = await axios(`http://localhost:3001/api/cuenta/transferir`, 
                  { params: 
                    { 
                      idorigen, 
                      iddestino, 
                      dinero }
                    })

  return data
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at: ${url}`)
})